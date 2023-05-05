/* eslint-disable camelcase */
import { parser as schemasafeParser, validator, ValidatorOptions } from '@exodus/schemasafe'

import fs_AccountData from './schema/AccountData.json'
import fs_Presence from './schema/Presence.json'
import fs_DeviceLists from './schema/DeviceLists.json'
import fs_Event from './schema/Event.json'

import fs_Invite from './schema/Invite.json'
import fs_ClientEventWithoutRoomID from './schema/ClientEventWithoutRoomID.json'
import fs_StrippedStateEvent from './schema/StrippedStateEvent.json'
import fs_InviteState from './schema/InviteState.json'

import fs_InvitedRoom from './schema/InvitedRoom.json'
import fs_JoinedRoom from './schema/JoinedRoom.json'
import fs_KnockedRoom from './schema/KnockedRoom.json'
import fs_LeftRoom from './schema/LeftRoom.json'

import fs_Ephemeral from './schema/Ephemeral.json'

import fs_State from './schema/State.json'
import fs_RoomSummary from './schema/RoomSummary.json'
import fs_Timeline from './schema/Timeline.json'
import fs_NotificationCounts from './schema/NotificationCounts.json'

import fs_ToDevice from './schema/ToDevice.json'

import fs_GET_client_v3_sync from './schema/GET_client_v3_sync.json'

import fs_m_room_create from './schema/m_room_create.json'
import fs_m_room_canonical_alias from './schema/m_room_canonical_alias.json'
import fs_m_room_join_rules from './schema/m_room_join_rules.json'
import fs_m_room_member from './schema/m_room_member.json'
import fs_m_room_power_levels from './schema/m_room_power_levels.json'
import fs_m_room_name from './schema/m_room_name.json'
import fs_m_room_topic from './schema/m_room_topic.json'
import fs_m_room_avatar from './schema/m_room_avatar.json'
import fs_m_pinned_events from './schema/m_room_pinned_events.json'

const parserOptions: ValidatorOptions = {
  mode: 'default',
  requireValidation: false,
  complexityChecks: true,
  includeErrors: !import.meta.env.PROD,
  schemas: {
    AccountData: fs_AccountData,

    Presence: fs_Presence,

    DeviceLists: fs_DeviceLists,

    Event: fs_Event,

    Invite: fs_Invite,

    ClientEventWithoutRoomID: fs_ClientEventWithoutRoomID,

    StrippedStateEvent: fs_StrippedStateEvent,

    InviteState: fs_InviteState,

    InvitedRoom: fs_InvitedRoom,
    JoinedRoom: fs_JoinedRoom,
    KnockedRoom: fs_KnockedRoom,
    LeftRoom: fs_LeftRoom,

    Ephemeral: fs_Ephemeral,

    State: fs_State,
    RoomSummary: fs_RoomSummary,
    Timeline: fs_Timeline,
    NotificationCounts: fs_NotificationCounts,

    ToDevice: fs_ToDevice
  }
}

namespace schema {
  export const _well_known_matrix_client = schemasafeParser({
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      'm.homeserver': {
        type: 'object',
        properties: {
          base_url: {
            type: 'string',
            format: 'uri',
            pattern: '^https://.*$'
          }
        },
        required: [
          'base_url'
        ]
      },
      'm.identity_server': {
        type: 'object',
        properties: {
          base_url: {
            type: 'string',
            format: 'uri',
            pattern: '^https?://.*$'
          }
        },
        required: [
          'base_url'
        ]
      }
    },
    required: [
      'm.homeserver'
    ]
  }, parserOptions)

  export const client_versions = schemasafeParser({
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      unstable_features: {
        type: 'object',
        properties: {},
        required: []
      },
      versions: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    required: [
      'versions'
    ]
  }, parserOptions)

  export const response_error = schemasafeParser({
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      errcode: {
        type: 'string'
      },
      error: {
        type: 'string'
      },
      retry_after_ms: {
        type: 'number'
      },
      soft_logout: {
        type: 'boolean'
      }
    },
    required: [
      'errcode'
    ]
  }, parserOptions)

  // Account related

  export const GET_client_v3_login = schemasafeParser({
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      flows: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            type: {
              type: 'string'
            }
          },
          required: [
            'type'
          ]
        }
      }
    },
    required: [
      'flows'
    ]
  }, parserOptions)

  export const POST_client_v3_login = schemasafeParser({
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      access_token: {
        type: 'string'
      },
      device_id: {
        type: 'string'
      },
      expires_in_ms: {
        type: 'number'
      },
      refresh_token: {
        type: 'string'
      },
      user_id: {
        type: 'string'
      },
      well_known: {
        type: 'object',
        properties: {
          'm.homeserver': {
            type: 'object',
            properties: {
              base_url: {
                type: 'string'
              }
            },
            required: [
              'base_url'
            ]
          },
          'm.identity_server': {
            type: 'object',
            properties: {
              base_url: {
                type: 'string'
              }
            },
            required: [
              'base_url'
            ]
          }
        },
        required: [
          'm.homeserver'
        ]
      }
    },
    required: [
      'access_token',
      'device_id',
      'user_id'
    ]
  }, parserOptions)

  export const POST_client_v3_refresh = schemasafeParser({
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      access_token: {
        type: 'string'
      },
      expires_in_ms: {
        type: 'number'
      },
      refresh_token: {
        type: 'string'
      }
    },
    required: ['access_token']
  }, parserOptions)

  // Events related

  export const GET_client_v3_sync = schemasafeParser(fs_GET_client_v3_sync, parserOptions)

  // Events

  export const m_room_create = validator(fs_m_room_create, parserOptions)
  export const m_room_canonical_alias = validator(fs_m_room_canonical_alias, parserOptions)
  export const m_room_join_rules = validator(fs_m_room_join_rules, parserOptions)
  export const m_room_member = validator(fs_m_room_member, parserOptions)
  export const m_room_power_levels = validator(fs_m_room_power_levels, parserOptions)
  export const m_room_name = validator(fs_m_room_name, parserOptions)
  export const m_room_topic = validator(fs_m_room_topic, parserOptions)
  export const m_room_avatar = validator(fs_m_room_avatar, parserOptions)
  export const m_room_pinned_events = validator(fs_m_pinned_events, parserOptions)
}

export default schema
