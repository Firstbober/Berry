import { ProviderInfo } from './common'
import ClientLocalData from './matrix/clientLocalData'
import { Error, ErrorType } from './error'

// eslint-disable-next-line no-undef
const mWorker = new ComlinkWorker<typeof import('./matrix')>(
  new URL('./matrix', import.meta.url)
)

const PREFIX = 'berrychat_'
const dataPerClient: ClientLocalData[] = []
let currentClient = -1

// Create comlink-wrapped account class instance to act like a namespace
const apiAccount = await new mWorker.Account()
const apiEvents = await new mWorker.Events()

export namespace client {
  /// Load all client data from the localStorage.
  export function loadClientsFromStorage () {
    console.log('loading...')

    if (!localStorage.getItem(`${PREFIX}clients`)) return
    // [1, 2, 3, ...]
    const berryClients = JSON.parse(localStorage.getItem(`${PREFIX}clients`))
    dataPerClient.length = 0

    for (const cID of berryClients) {
      const clientLocalData: ClientLocalData = {
        id: Number(cID),
        finalized: true,
        active: false,

        providerInfo: null,

        accessToken: '',
        deviceID: '',
        userID: '',

        expiresInMs: null,
        refreshToken: null
      }

      for (const key of Object.keys(clientLocalData)) {
        const data = localStorage.getItem(`${PREFIX}${cID}_${key}`)
        if (!data) continue

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        clientLocalData[key] = JSON.parse(data)
      }

      dataPerClient.push(clientLocalData)
    }

    const currentClientLS = localStorage.getItem(`${PREFIX}currentClient`)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    if (currentClientLS) currentClient = JSON.parse(currentClientLS)

    saveClientsToStorage()
  }

  /// Save current client data into localStorage.
  export function saveClientsToStorage () {
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

      idToIDXclientDataMap[clientData.id] = i
    }

    localStorage.setItem(`${PREFIX}currentClient`, JSON.stringify(currentClient))
  }

  const idToIDXclientDataMap: number[] = []
  // TODO
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function getClientData (id: number): ClientLocalData {
    return dataPerClient[idToIDXclientDataMap[id]]
  }

  // TODO: We might want to intercept the call and cache the results for future use.
  export async function validateDomain (domain: string) {
    return mWorker.validateDomain(domain)
  }

  export namespace account {
    export function isLoggedIn (): boolean {
      return dataPerClient.length > 0
    }

    /**
     * Get login flows supported by the homeserver
     * https://spec.matrix.org/v1.5/client-server-api/#authentication-types
     *
     * @param homeserver Homeserver
     */
    export async function loginGetFlows (homeserver: string) {
      return apiAccount.loginGetFlows(homeserver)
    }

    /// Log in into user account using login + password combo. This will also create new client data.
    export async function loginPassword (provider: ProviderInfo, username: string, password: string): AResult<object, Error> {
      const loginState = await apiAccount.loginPassword(provider.homeserver, username, password)
      if (loginState.ok === false) return loginState

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

      return { ok: true, value: {} }
    }
  }

  export namespace events {
    /**
     * Start /sync long-polling loop with full sync if required.
     *
     * In case of returning an Error, the caller should handle
     * only Network and in the case of any other error, prompt to re-log.
     */
    export async function startSyncingLoop (): AResult<boolean, Error> {
      const clientData = getClientData(currentClient)
      const res = await apiEvents.sync(clientData)

      if (res.ok == false) {
        // Try to refresh access token
        if (res.error.type == ErrorType.InvalidToken) {
          // Server invalidated our entire session, so we prompt to re-log.
          if (res.error.soft_logout == false) {
            console.info('Our token is invalid, so is our session, re-log.')
            return res
          }

          console.info('We can refresh our access token, trying right now.')

          // Refresh an access token.
          const rfRes = await apiAccount.refreshAccessToken(
            clientData.providerInfo.homeserver,
            clientData.refreshToken
          )

          if (rfRes.ok == false) return rfRes

          console.info('Successfully refreshed access token, retrying /sync')

          clientData.accessToken = rfRes.value.access_token
          if (rfRes.value.expires_in_ms) clientData.expiresInMs = rfRes.value.expires_in_ms
          if (rfRes.value.refresh_token) clientData.refreshToken = rfRes.value.refresh_token
          saveClientsToStorage()

          return startSyncingLoop()
        } else {
          return res
        }
      }

      // For now, just print the returned data.
      console.log(res.value)

      return { ok: false, error: { type: ErrorType.Internal } }
    }
  }
}
