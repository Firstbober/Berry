/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { mfetch, ProviderInfo } from "./common";
import { Error, ErrorType } from "./error";
import { account as _account } from "./matrix/account";
import schema from "./matrix/schema";

/// Validate passed domain according to https://spec.matrix.org/v1.5/client-server-api/#server-discovery.
export async function validateDomain(domain: string): AResult<ProviderInfo, Error> {
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

// Export classes to be accessible from worker instance and act like a namespace.
export const account = _account