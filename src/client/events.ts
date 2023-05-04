import { Validate, Json } from '@exodus/schemasafe'
import { cache } from './cache'
import { _ApiEvents, _ApiAccount, client } from './client'
import { Error, ErrorType } from './error'
import ClientLocalData from './matrix/clientLocalData'
import schema from './matrix/schema'
import { ClientEventWithoutRoomID } from './matrix/schema/gen_types/ClientEventWithoutRoomID'
import { GETClientV3Sync } from './matrix/schema/gen_types/GET_client_v3_sync'
import { MRoomCanonicalAlias } from './matrix/schema/gen_types/m_room_canonical_alias'
import { MRoomCreate } from './matrix/schema/gen_types/m_room_create'

type EventType = 'm.room.canonical_alias' | 'm.room.create'

export class Events {
  clientData: ClientLocalData
  apiEvents: _ApiEvents
  apiAccount: _ApiAccount

  init (clientData: ClientLocalData, apiEvents: _ApiEvents, apiAccount: _ApiAccount) {
    this.clientData = clientData
    this.apiEvents = apiEvents
    this.apiAccount = apiAccount
  }

  private validateEvent<T> (type: EventType, validator: Validate, evContent: object): Result<T, Error> {
    if (!validator(evContent as Json)) {
      console.warn(`Validation failed for ${type} event type.`, evContent)
      return {
        ok: false,
        error: {
          type: ErrorType.InvalidJSON
        }
      }
    }
    return { ok: true, value: evContent as T }
  }

  private roomStateEvent (room: cache.Room, ev: ClientEventWithoutRoomID) {
    const checkEv = <T>(type: EventType, validator: Validate, then: (c: T) => void): [string, EventType] => {
      if (ev.type == type) {
        const c = this.validateEvent<T>(type, validator, ev.content)
        if (c.ok == false) return

        then(c.value)
        return [room.id, type]
      }
      return undefined
    }

    let eR = checkEv<MRoomCanonicalAlias>('m.room.canonical_alias', schema.m_room_canonical_alias, (c) => {
      room.state.canonicalAlias = c.alias
      room.state.alternativeAliases = c.alt_aliases
    })

    eR = checkEv<MRoomCreate>('m.room.create', schema.m_room_create, (c) => {
      room.state.creator = c.creator
      room.state.federate = c['m.federate'] ? c['m.federate'] : true

      if (c.predecessor) {
        room.state.predecessor.roomID = c.predecessor.room_id
        room.state.predecessor.eventID = c.predecessor.event_id
      }

      room.state.version = c.room_version ? c.room_version : '1'

      room.type = c.type
        ? c.type == 'm.space'
          ? 'space'
          : 'any'
        : 'any'
    })

    return eR
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

    const readStateEvents = (room: cache.Room, events: ClientEventWithoutRoomID[]) => {
      const changes: [string, EventType][] = []

      for (const event of events) {
        if (event.state_key != undefined || event.state_key == '') changes.push(this.roomStateEvent(room, event))
      }

      return changes
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
            const room: cache.Room = cache.getOrCreateRoom(dRoomK)

            // If there are any state events, iterate over them and update cached room.
            if (dRoomV.state.events) readStateEvents(room, dRoomV.state.events)

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
