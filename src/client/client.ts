import { ProviderInfo } from "./common";
import ClientLocalData from "./matrix/clientLocalData";

const mWorker = new ComlinkWorker<typeof import("./matrix")>(
	new URL("./matrix", import.meta.url)
);

const PREFIX = "berrychat_"
const dataPerClient: ClientLocalData[] = []
let currentClient = 0

// Create comlink-wrapped account class instance to act like a namespace
const api_Account = await new mWorker.account()

export namespace client {
	/// Load all client data from the localStorage.
	export function loadClientsFromStorage() {
		if (!localStorage.getItem(`${PREFIX}clients`)) return;
		// [1, 2, 3, ...]
		const berryClients = localStorage.getItem(`${PREFIX}clients`);

		for (const cID of berryClients) {
			let clientLocalData: ClientLocalData = {
				id: Number(cID),
				finalized: true,

				accessToken: ""
			}

			for (const key of Object.keys(clientLocalData)) {
				const data = localStorage.getItem(`${PREFIX}${cID}_${key}`)
				if (!data) continue;

				clientLocalData[key] = data
			}

			dataPerClient.push(clientLocalData)
		}

		// TODO: Here we should also load which client is currently selected as active.
	}

	/// Save current client data into localStorage.
	export function saveClientsToStorage() {
		localStorage.setItem(`${PREFIX}clients`, JSON.stringify(
			dataPerClient.map((v) => {
				return v.id
			})
		))

		for (const clientData of dataPerClient) {
			if (!clientData.finalized) continue

			for (const [key, val] of Object.entries(clientData)) {
				localStorage.setItem(`${PREFIX}${clientData.id}_${key}`, val)
			}
		}

		// TODO: Here we should also save which client is currently selected as active.
	}

	// TODO: We might want to intercept the call and cache the results for future use.
	export async function validateDomain(domain: string) {
		return mWorker.validateDomain(domain)
	}

	export namespace account {
		/**
		 * Get login flows supported by the homeserver
		 * https://spec.matrix.org/v1.5/client-server-api/#authentication-types
		 *
		 * @param homeserver Homeserver
		 */
		export async function loginGetFlows(homeserver: string) {
			return api_Account.loginGetFlows(homeserver)
		}

		/// Log in into user account using login + password combo. This will also create new client data.
		export async function loginPassword(provider: ProviderInfo, username: string, password: string) {
			return api_Account.loginPassword(provider.homeserver, username, password)
		}
	}
}