/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { UAParser } from "ua-parser-js";
import { Error, ErrorType } from "./error";
import schema from "./matrix/schema";

/// An array of versions which are supported by the Berry.
const SUPPORTED_CLIENT_VERSIONS = ["1.5"]

/// Wrapper for fetch function with Result as return type.
async function mfetch(input: RequestInfo | URL, init?: RequestInit): AResult<Response, Error> {
	let response: Response;
	try {
		response = await fetch(input, init);
	} catch (error) {
		return { ok: false, error: { type: ErrorType.Network } };
	}

	return { ok: true, value: response }
}

/// Returns display name for this client constructed from User-Agent.
function getClientDisplayName() {
	const ua = new UAParser(navigator.userAgent).getResult()
	return `Berry on ${Object.keys(ua.device).length == 0
		? Object.keys(ua.os).length == 0
			? Object.keys(ua.browser).length == 0
				? "Unknown"
				: ua.browser.name
			: Object.keys(ua.browser).length == 0
				? ua.os.name
				: `${ua.browser.name} ${ua.os.name}`
		: ua.device.model}`
}

/// Transform Matrix error JSON into internal errors.
function matrixErrcode(error: any): Error {
	const errcode = error["errcode"]

	if (errcode == "M_FORBIDDEN") return { type: ErrorType.Forbidden }
	if (errcode == "M_UNKNOWN_TOKEN") return { type: ErrorType.InvalidToken }
	if (errcode == "M_MISSING_TOKEN") return { type: ErrorType.NoToken }
	if (errcode == "M_BAD_JSON") return { type: ErrorType.MalformedJSON }
	if (errcode == "M_NOT_JSON") return { type: ErrorType.InvalidJSON }
	if (errcode == "M_NOT_FOUND") return { type: ErrorType.NotFound }
	if (errcode == "M_LIMIT_EXCEEDED") return { type: ErrorType.RateLimited, retryAfterMs: errcode["retry_after_ms"] ? errcode["retry_after_ms"] : 2000 }
	if (errcode == "M_UNKNOWN") return { type: ErrorType.Internal, reason: errcode["error"] }

	if (errcode == "M_UNAUTHORIZED") return { type: ErrorType.Unauthorized }
	if (errcode == "M_USER_DEACTIVATED") return { type: ErrorType.UserDeactivated }
}

/// Validate passed domain according to https://spec.matrix.org/v1.5/client-server-api/#server-discovery.
export async function validateDomain(domain: string): AResult<{
	homeserver: string,
	identityServer?: string,
	versions: string[],
	unstableFeatures: { [key: string]: boolean }
}, Error> {
	// TODO: Maybe we should sanitize the domain?
	const wellKnown = await mfetch(`https://${domain}/.well-known/matrix/client`)
	const versions = await mfetch(`https://${domain}/_matrix/client/versions`)
	if (versions.ok == false) return versions

	let homeserver: string
	let identityServer: string | undefined
	let versionsArray: string[]
	let unstableFeatures: { [key: string]: boolean }

	// Check data returned from /.well-known/matrix/client and pass it further.
	if (wellKnown.ok) {
		const rbody = await wellKnown.value.text()
		const pres = schema._well_known_matrix_client(rbody);

		if (!pres.valid) return { ok: false, error: { type: ErrorType.InvalidJSON } }

		// TODO: As we don't trust the json from the server, the base_url also can be invalid.
		homeserver = new URL(pres.value["m.homeserver"]["base_url"]).origin
		identityServer = pres.value["m.identity_server"] == undefined ? undefined : new URL(pres.value["m.identity_server"]["base_url"]).origin

	} else {
		homeserver = new URL(`https://${domain}`).origin
	}

	// If identity server was found, then check if it's valid.
	if (identityServer != undefined) {
		const identityV2 = await mfetch(`${identityServer}/_matrix/identity/v2`)
		if (!identityV2.ok || identityV2.value.status != 200) identityServer = undefined
	}

	// Check if data returned from /_matrix/client/versions is valid.
	{
		const rbody = await versions.value.text()
		const pres = schema.client_versions(rbody);

		if (!pres.valid) return { ok: false, error: { type: ErrorType.InvalidJSON } }
		versionsArray = pres.value["versions"]

		unstableFeatures = pres.value["unstable_features"] != undefined ? pres.value["unstable_features"] : {}
	}

	return {
		ok: true, value: {
			homeserver,
			identityServer,
			versions: versionsArray,
			unstableFeatures
		}
	};
}

/// Get supported login flows https://spec.matrix.org/v1.5/client-server-api/#authentication-types.
export async function loginGetFlows(homeserver: string): AResult<string[], Error> {
	const req = await mfetch(`${homeserver}/_matrix/client/v3/login`)
	if (req.ok == false) return req

	if (req.value.status == 429) {
		const pres = schema.response_error(await req.value.text())
		return {
			ok: false,
			error: pres.valid ? matrixErrcode(pres.value) : {
				type: ErrorType.RateLimited,
				retryAfterMs: 2000
			}
		}
	}

	if (req.value.status != 200) return {
		ok: false,
		error: { type: ErrorType.Network }
	}

	const pres = schema.GET_client_v3_login(await req.value.text())
	if (!pres.valid) return {
		ok: false,
		error: { type: ErrorType.InvalidJSON }
	}

	return {
		ok: true,
		value: pres.value["flows"].map((flow: { type: string }) => flow.type)
	}
}

/// https://spec.matrix.org/v1.5/client-server-api/#post_matrixclientv3login.
export async function loginPassword(homeserver: string, username: string, password: string): AResult<{
	accessToken: string,
	deviceID: string,
	userID: string,

	expiresInMs?: number,
	refreshToken?: string,
	wellKnown_homeServer?: string,
	wellKnown_identityServer?: string
}, Error> {
	// Send POST request to the home server.
	const res = await mfetch(`${homeserver}/_matrix/client/v3/login`, {
		method: 'POST',
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			identifier: {
				type: "m.id.user",
				user: username
			},
			initial_device_display_name: getClientDisplayName(),
			password,
			refresh_token: true,
			type: "m.login.password"
		})
	})
	if (res.ok == false) return res

	// Handle all documented errors, 400, 403 and 429.
	if (res.value.status >= 400 && res.value.status <= 429) {
		const pres = schema.response_error(await res.value.text())
		if (!pres.valid) return { ok: false, error: { type: ErrorType.InvalidJSON } }

		return { ok: false, error: matrixErrcode(pres.value) }
	}

	// Check if response is in check with the schema.
	const pres = schema.POST_client_v3_login(await res.value.text())
	if (!pres.valid) return { ok: false, error: { type: ErrorType.InvalidJSON } }

	// Check if response contains well_known object and extract home server url origin
	// as well as optionally identity server url origin.
	let homeServer: string | undefined = undefined
	let identityServer: string | undefined = undefined

	if (pres.value["well_known"] != undefined) {
		homeServer = new URL(pres.value["well_known"]["m.homeserver"]["base_url"]).origin
		if (pres.value["well_known"]["m.identity_server"] != undefined)
			identityServer = new URL(pres.value["well_known"]["m.identity_server"]["base_url"]).origin
	}

	return {
		ok: true,
		value: {
			accessToken: pres.value["access_token"],
			deviceID: pres.value["device_id"],
			userID: pres.value["user_id"],

			expiresInMs: pres.value["expires_in_ms"],
			refreshToken: pres.value["refresh_token"],
			wellKnown_homeServer: homeServer,
			wellKnown_identityServer: identityServer
		}
	}
}