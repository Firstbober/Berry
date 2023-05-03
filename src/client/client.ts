import { ProviderInfo } from './common'
import ClientLocalData from './matrix/clientLocalData'
import { Error, ErrorType } from './error'

// Import from external libraries.
import localForage from 'localforage'

// Import from generated types.
import { GETClientV3Sync } from './matrix/schema/gen_types/GET_client_v3_sync'
import { Event } from './matrix/schema/gen_types/Event'
import { JoinedRoom } from './matrix/schema/gen_types/JoinedRoom'
import { KnockedRoom } from './matrix/schema/gen_types/KnockedRoom'
import { LeftRoom } from './matrix/schema/gen_types/LeftRoom'
import { InvitedRoom } from './matrix/schema/gen_types/InvitedRoom'
import { ClientEventWithoutRoomID } from './matrix/schema/gen_types/ClientEventWithoutRoomID'
import schema from './matrix/schema'
import { MRoomCreate } from './matrix/schema/gen_types/m_room_create'
import { MRoomCanonicalAlias } from './matrix/schema/gen_types/m_room_canonical_alias'

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
  /// Here are all the cached values like rooms, spaces, etc.
  export namespace cache {
    interface RoomBase {
      state: {
        canonicalAlias?: string,
        alternativeAliases?: string[],

        creator: string,
        federate: boolean,
        predecessor?: {
          eventID: string,
          roomID: string
        },
        version: string,

        join_rules: {
          rule: 'public' | 'knock' | 'invite' | 'private' | 'restricted'
          allow: {
            roomID?: string,
            type: 'm.room.membership'
          }[]
        },

        members: {
          id: string,
          avatarUrl?: string,
          displayName?: string,
          membership: 'invite' | 'join' | 'knock' | 'leave' | 'ban',
          thirdPartyInvite?: {
            displayName: string
          },
          powerLevel: number
        }[],

        powerLevels: {
          ban: number,
          events: {[k: string]: number},
          eventsDefault: number,
          invite: number,
          kick: number,
          notifications: {
            room: number
          },
          redact: number,
          stateDefault: number,
          usersDefault: number
        }
      }
    }

    export interface AnyRoom extends RoomBase {
      type: 'any'
    }

    export interface Space extends RoomBase {
      type: 'space',
      rooms: AnyRoom | Space
    }

    export const rooms: { [k: string]: AnyRoom | Space } = {}
  }

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

  export namespace events {
    /**
     * Start /sync long-polling loop with full sync if required.
     *
     * In case of returning an Error, the caller should handle
     * only Network and in the case of any other error, prompt to re-log.
     */
    export async function startSyncingLoop (): AResult<boolean, Error> {
      const clientData = getClientData(currentClient)
      syncStore.nextBatch = null
      const res = await apiEvents.sync(clientData, syncStore.nextBatch == null ? undefined : syncStore.nextBatch)

      // Handle response error.
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

      const dedupEvents = (events: Event[]): Event[] => {
        const seen = new Set()

        return events.filter(el => {
          const duplicate = seen.has(el.type)
          seen.add(el.type)
          return !duplicate
        })
      }

      /// Modify room passed to the arguments of this function based on the event
      const updateRoomViaStateEvent = (room: cache.AnyRoom | cache.Space, event: ClientEventWithoutRoomID) => {
        if (event.type == 'm.room.canonical_alias') {
          if (!schema.m_room_canonical_alias(event.content as null)) {
            return console.warn('Validation failed for m.room.canonical_alias event type.', event.content)
          }
          const content = event.content as MRoomCanonicalAlias

          room.state.canonicalAlias = content.alias
          room.state.alternativeAliases = content.alt_aliases

          return
        }

        if (event.type == 'm.room.create') {
          if (!schema.m_room_create(event.content as null)) {
            return console.warn('Validation failed for m.room.create event type.', event.content)
          }
          const content = event.content as MRoomCreate

          room.state.creator = content.creator
          room.state.federate = content['m.federate'] ? content['m.federate'] : true

          if (content.predecessor) {
            room.state.predecessor.roomID = content.predecessor.room_id
            room.state.predecessor.eventID = content.predecessor.event_id
          }

          room.state.version = content.room_version ? content.room_version : '1'

          room.type = content.type
            ? content.type == 'm.space'
              ? 'space'
              : 'any'
            : 'any'
        }
      }

      const updateData = async (data: GETClientV3Sync) => {
        // Comment out for now until we find the best way to store things.
        // syncStore.nextBatch = data.next_batch

        if (data.rooms) {
          // Read data from rooms.join.
          if (data.rooms.join) {
            // Iterate over joined rooms.
            for (const [dRoomK, dRoomV] of Object.entries(data.rooms.join)) {
              const room: cache.AnyRoom | cache.Space = Object.hasOwn(cache.rooms, dRoomK)
                ? cache.rooms[dRoomK]
                : {
                    type: 'any',

                    state: {
                      creator: '',
                      federate: true,
                      version: '1',

                      join_rules: {
                        rule: 'invite',
                        allow: []
                      },

                      members: [],

                      powerLevels: {
                        ban: 50,
                        events: {},
                        eventsDefault: 0,
                        invite: 0,
                        kick: 50,
                        notifications: {
                          room: 50
                        },
                        redact: 50,
                        stateDefault: 50,
                        usersDefault: 0
                      }
                    }
                  }

              // If there are any state events, iterate over them and update cached room.
              if (dRoomV.state.events) {
                for (const event of dRoomV.state.events) {
                  if (event.state_key != undefined || event.state_key == '') updateRoomViaStateEvent(room, event)
                }
              }

              console.log(room)
            }
          }
        }

        await syncStore.save()

        console.log(data)
      }

      await updateData(res.value)

      return { ok: false, error: { type: ErrorType.Internal } }
    }
  }
}
