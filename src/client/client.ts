import { ProviderInfo } from './common'
import ClientLocalData from './matrix/clientLocalData'
import { Error } from './error'

// Import from external libraries.
import localForage from 'localforage'

// Import from generated types.
import { Event } from './matrix/schema/gen_types/Event'
import { JoinedRoom } from './matrix/schema/gen_types/JoinedRoom'
import { KnockedRoom } from './matrix/schema/gen_types/KnockedRoom'
import { LeftRoom } from './matrix/schema/gen_types/LeftRoom'
import { InvitedRoom } from './matrix/schema/gen_types/InvitedRoom'

import { Events } from './events'

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

export type _ApiEvents = typeof apiEvents
export type _ApiAccount = typeof apiAccount

/// Namespace for /sync endpoint data storage.
namespace syncStore {
  const store = localForage.createInstance({
    name: 'Berry Storage',
    storeName: 'sync'
  })

  // TODO Implement some system of marking the field, so we don't
  // push everything to the DB everytime.

  export let nextBatch: string | null
  export let accountData: Event[]
  export let presence: Event[]
  export let roomsInvite: { [k: string]: InvitedRoom }
  export let roomsJoin: { [k: string]: JoinedRoom }
  export let roomsKnock: { [k: string]: KnockedRoom }
  export let roomsLeave: { [k: string]: LeftRoom }

  /// Load all the data from the IndexedDB.
  export async function load () {
    nextBatch = await store.getItem('next_batch')
    accountData = await store.getItem('account_data')
    presence = await store.getItem('presence')
    roomsInvite = await store.getItem('rooms_invite')
    roomsJoin = await store.getItem('rooms_join')
    roomsKnock = await store.getItem('rooms_knock')
    roomsLeave = await store.getItem('rooms_leave')

    accountData ??= []
    presence ??= []
    roomsInvite ??= {}
    roomsJoin ??= {}
    roomsKnock ??= {}
    roomsLeave ??= {}
  }

  /// Save all the data to the IndexedDB.
  export async function save () {
    await store.setItem('next_batch', nextBatch)
    await store.setItem('account_data', accountData)
    await store.setItem('presence', presence)
    await store.setItem('rooms_invite', roomsInvite)
    await store.setItem('rooms_join', roomsJoin)
    await store.setItem('rooms_knock', roomsKnock)
    await store.setItem('rooms_leave', roomsLeave)
  }
}

export namespace client {
  /// Load all client data from the localStorage and init localForage for big data storage.
  export function loadClientsFromStorage () {
    console.log('loading...')

    // Init localforage
    localForage.config({
      driver: localForage.INDEXEDDB,
      name: 'Berry Storage'
    })

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
    events.init(
      getClientData(currentClient),
      apiEvents,
      apiAccount
    )
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

  /// Loads all the stores in the code.
  export async function loadStores () {
    await syncStore.load()
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

  export const events = new Events()
}
