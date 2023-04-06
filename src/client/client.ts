import { ProviderInfo } from "./common";
import ClientLocalData from "./matrix/clientLocalData";

const mWorker = new ComlinkWorker<typeof import("./matrix")>(
	new URL("./matrix", import.meta.url)
);

const PREFIX = "berrychat_"
const dataPerClient: ClientLocalData[] = []
let currentClient = -1

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
				active: false,

				accessToken: "",
				deviceID: "",
				userID: ""
			}

			for (const key of Object.keys(clientLocalData)) {
				const data = localStorage.getItem(`${PREFIX}${cID}_${key}`)
				if (!data) continue;

				clientLocalData[key] = JSON.parse(data)
			}

			dataPerClient.push(clientLocalData)
		}

		const currentClientLS = localStorage.getItem(`${PREFIX}currentClient`)
		if (currentClientLS) currentClient = JSON.parse(currentClientLS)
	}

	/// Save current client data into localStorage.
	export function saveClientsToStorage() {
		localStorage.setItem(`${PREFIX}clients`, JSON.stringify(
			dataPerClient.map((v) => {
				return v.id
			})
		))

		let i = -1
		for (const clientData of dataPerClient) {
			i += 1
			if (!clientData.finalized) continue

			for (const [key, val] of Object.entries(clientData)) {
				localStorage.setItem(`${PREFIX}${clientData.id}_${key}`, JSON.stringify(val))
			}

			id_to_idx_clientdata_map[clientData.id] = i
		}

		localStorage.setItem(`${PREFIX}currentClient`, JSON.stringify(currentClient))
	}

	let id_to_idx_clientdata_map = []
	function getClientData(id: number): ClientLocalData {
		return dataPerClient[id_to_idx_clientdata_map[id]]
	}

	// TODO: We might want to intercept the call and cache the results for future use.
	export async function validateDomain(domain: string) {
		return mWorker.validateDomain(domain)
	}

	export namespace account {
		export function isLoggedIn(): boolean {
			return dataPerClient.length > 0
		}

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
			const loginState = await api_Account.loginPassword(provider.homeserver, username, password)
			if (loginState.ok == false) return loginState

			const data: ClientLocalData = {
				id: Math.max(...dataPerClient.map((v) => v.id), 0),
				finalized: true,
				active: true,

				providerInfo: provider,

				accessToken: loginState.value.accessToken,
				deviceID: loginState.value.deviceID,
				userID: loginState.value.userID,

				expiresInMs: loginState.value.expiresInMs,
				refreshToken: loginState.value.refreshToken
			}

			dataPerClient.push(data)
			currentClient = data.id

			saveClientsToStorage()
		}
	}
}