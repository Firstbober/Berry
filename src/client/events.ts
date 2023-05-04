import { cache } from './cache'
import { _ApiEvents, _ApiAccount, client } from './client'
import { Error, ErrorType } from './error'
import ClientLocalData from './matrix/clientLocalData'
import schema from './matrix/schema'
import { ClientEventWithoutRoomID } from './matrix/schema/gen_types/ClientEventWithoutRoomID'
import { GETClientV3Sync } from './matrix/schema/gen_types/GET_client_v3_sync'
import { MRoomCanonicalAlias } from './matrix/schema/gen_types/m_room_canonical_alias'
import { MRoomCreate } from './matrix/schema/gen_types/m_room_create'

export class Events {
  clientData: ClientLocalData
  apiEvents: _ApiEvents
  apiAccount: _ApiAccount

  init (clientData: ClientLocalData, apiEvents: _ApiEvents, apiAccount: _ApiAccount) {
    this.clientData = clientData
    this.apiEvents = apiEvents
    this.apiAccount = apiAccount
  }

  /**
   * Start /sync long-polling loop with full sync if required.
   *
   * In case of returning an Error, the caller should handle
   * only Network and in the case of any other error, prompt to re-log.
   */
  async startSyncingLoop (): AResult<boolean, Error> {
    const res = await this.apiEvents.sync(this.clientData)

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
        const rfRes = await this.apiAccount.refreshAccessToken(
          this.clientData.providerInfo.homeserver,
          this.clientData.refreshToken
        )

        if (rfRes.ok == false) return rfRes

        console.info('Successfully refreshed access token, retrying /sync')

        this.clientData.accessToken = rfRes.value.access_token
        if (rfRes.value.expires_in_ms) this.clientData.expiresInMs = rfRes.value.expires_in_ms
        if (rfRes.value.refresh_token) this.clientData.refreshToken = rfRes.value.refresh_token
        client.saveClientsToStorage()

        return this.startSyncingLoop()
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

    /// Modify room passed to the arguments of this function based on the event.
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

    /// Read all the data from the sync endpoint.
    const updateData = (data: GETClientV3Sync) => {
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

      // await syncStore.save()

      console.log(data)
    }

    updateData(res.value)

    return { ok: false, error: { type: ErrorType.Internal } }
  }
}
