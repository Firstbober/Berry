import { UAParser } from "ua-parser-js";
import { Error, ErrorType } from "./error";

/// An array of versions which are supported by the Berry.
export const SUPPORTED_CLIENT_VERSIONS = ["1.5"]

/// Wrapper for fetch function with Result as return type.
export async function mfetch(input: RequestInfo | URL, init?: RequestInit): AResult<Response, Error> {
	let response: Response;
	try {
		response = await fetch(input, init);
	} catch (error) {
		return { ok: false, error: { type: ErrorType.Network } };
	}

	return { ok: true, value: response }
}

/// Returns display name for this client constructed from User-Agent.
export function getClientDisplayName() {
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
export function matrixErrcode(error: any): Error {
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

/// Necessary information about the provider (home server)
export interface ProviderInfo {
	homeserver: string,
	identityServer?: string,
	versions: string[],
	unstableFeatures: { [key: string]: boolean }
}