const mWorker = new ComlinkWorker<typeof import("./matrix")>(
	new URL("./matrix", import.meta.url)
);


export namespace client {
	export const validateDomain = mWorker.validateDomain
}