const mWorker = new ComlinkWorker<typeof import("./matrix")>(
	new URL("./matrix", import.meta.url)
);

export namespace client {
	// TODO: We might want to intercept the call and cache the results for future use.
	export const validateDomain = mWorker.validateDomain
}