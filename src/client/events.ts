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
import { MRoomJoinRules } from './matrix/schema/gen_types/m_room_join_rules'
import { MRoomMember } from './matrix/schema/gen_types/m_room_member'
import { MRoomPowerLevels } from './matrix/schema/gen_types/m_room_power_levels'
import { MRoomName } from './matrix/schema/gen_types/m_room_name'
import { MRoomTopic } from './matrix/schema/gen_types/m_room_topic'
import { MRoomAvatar } from './matrix/schema/gen_types/m_room_avatar'
import { MRoomPinnedEvents } from './matrix/schema/gen_types/m_room_pinned_events'
import { MRoomHistoryVisibility } from './matrix/schema/gen_types/m_room_history_visibility'

type EventType =
  'm.room.canonical_alias'| 'm.room.create' | 'm.room.join_rules'
  | 'm.room.member' | 'm.room.power_levels' | 'm.room.name'
  | 'm.room.topic' | 'm.room.avatar' | 'm.room.pinned_events'
  | 'm.room.history_visibility'

export class Events {
  clientData: ClientLocalData
  apiEvents: _ApiEvents
  apiAccount: _ApiAccount

  /// Init events class with required data.
  init (clientData: ClientLocalData, apiEvents: _ApiEvents, apiAccount: _ApiAccount) {
    this.clientData = clientData
    this.apiEvents = apiEvents
    this.apiAccount = apiAccount
  }

  /// Validate event content with schema validator.
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

  /// Check if state event is interpretable by the client. If so,
  /// then modify the room accordingly.
  private roomStateEvent (room: cache.Room, ev: ClientEventWithoutRoomID) {
    /// Do required checks and call the function for better looking code.
    const checkEv = <T>(type: EventType, validator: Validate, then: (c: T) => void): [string, EventType] => {
      if (ev.type == type) {
        const c = this.validateEvent<T>(type, validator, ev.content)
        if (c.ok == false) return undefined

        then(c.value)
        return [room.id, type]
      }
      return undefined
    }

    let eR = checkEv<MRoomCanonicalAlias>('m.room.canonical_alias', schema.m_room_canonical_alias, (c) => {
      room.state.canonicalAlias = c.alias
      room.state.alternativeAliases = c.alt_aliases
    })
    if (eR != undefined) return eR

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
    if (eR != undefined) return eR

    eR = checkEv<MRoomJoinRules>('m.room.join_rules', schema.m_room_join_rules, (c) => {
      room.state.join_rules.rule = c.join_rule

      if (c.allow) {
        for (const allowRule of c.allow) {
          room.state.join_rules.allow = {}
          room.state.join_rules.allow[allowRule.room_id] = {
            type: allowRule.type
          }
        }
      }
    })
    if (eR != undefined) return eR

    eR = checkEv<MRoomMember>('m.room.member', schema.m_room_member, (c) => {
      room.state.members = {}
      room.state.members[ev.state_key] = {
        avatarUrl: c.avatar_url,
        displayName: c.displayname == null ? undefined : c.displayname,
        membership: c.membership,
        thirdPartyInvite: c.third_party_invite
          ? {
              displayName: c.third_party_invite.display_name
            }
          : undefined,
        powerLevel: room.state.powerLevels.usersDefault
      }
    })
    if (eR != undefined) return eR

    eR = checkEv<MRoomPowerLevels>('m.room.power_levels', schema.m_room_power_levels, (c) => {
      room.state.powerLevels.changed = true

      room.state.powerLevels.ban = c.ban ?? 50
      room.state.powerLevels.events = c.events ?? {}
      room.state.powerLevels.eventsDefault = c.events_default ?? 0
      room.state.powerLevels.invite = c.invite ?? 0
      room.state.powerLevels.kick = c.kick ?? 50
      room.state.powerLevels.notifications = {
        room: c.notifications ? c.notifications.room ?? 50 : 50
      }
      room.state.powerLevels.redact = c.redact ?? 50
      room.state.powerLevels.stateDefault = c.state_default ?? 0
      room.state.powerLevels.usersDefault = c.users_default ?? 0

      room.state.powerLevels.memberLevels = c.users ?? {}
    })
    if (eR != undefined) return eR

    eR = checkEv<MRoomName>('m.room.name', schema.m_room_name, (c) => {
      room.state.name = c.name
    })
    if (eR != undefined) return eR

    eR = checkEv<MRoomTopic>('m.room.topic', schema.m_room_topic, (c) => {
      room.state.topic = c.topic
    })
    if (eR != undefined) return eR

    eR = checkEv<MRoomAvatar>('m.room.avatar', schema.m_room_avatar, (c) => {
      if (c.url == undefined) {
        room.state.avatar = undefined
        return
      }

      room.state.avatar = {
        url: c.url,
        info: c.info
          ? {
              w: c.info.w,
              h: c.info.h,
              mimetype: c.info.mimetype,
              size: c.info.size,

              thumbnailUrl: c.info.thumbnail_url,
              thumbnailInfo: c.info.thumbnail_info
                ? {
                    w: c.info.thumbnail_info.w,
                    h: c.info.thumbnail_info.h,
                    mimetype: c.info.thumbnail_info.mimetype,
                    size: c.info.thumbnail_info.size
                  }
                : c.info.thumbnail_info
            }
          : c.info
      }
    })
    if (eR != undefined) return eR

    eR = checkEv<MRoomPinnedEvents>('m.room.pinned_events', schema.m_room_pinned_events, (c) => {
      room.state.pinnedEvents = c.pinned
    })
    if (eR != undefined) return eR

    eR = checkEv<MRoomHistoryVisibility>('m.room.history_visibility', schema.m_room_history_visibility, (c) => {
      room.state.historyVisibility = c.history_visibility
    })
    if (eR != undefined) return eR

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

    /// Read state events only from any passed events.
    const readStateEvents = (room: cache.Room, events: ClientEventWithoutRoomID[]) => {
      const changes: [string, EventType][] = []

      // Iterate over events.
      for (const event of events) {
        if (event.state_key != undefined || event.state_key == '') changes.push(this.roomStateEvent(room, event))
      }

      // Set member power level based on m.room.power_levels event.
      if (room.state.powerLevels.changed) {
        for (const [mId, mL] of Object.entries(room.state.powerLevels.memberLevels)) {
          if (!Object.hasOwn(room.state.members, mId)) continue
          room.state.members[mId].powerLevel = mL
        }
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
