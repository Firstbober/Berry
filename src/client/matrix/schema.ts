/* eslint-disable camelcase */
import { parser as schemasafeParser, ValidatorOptions } from '@exodus/schemasafe'

const parserOptions: ValidatorOptions = {
  mode: 'default',
  requireValidation: false,
  complexityChecks: true,
  schemas: {
    AccountData: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        events: {
          type: 'array',
          items: {
            $ref: 'Event#'
          }
        }
      }
    },

    Presence: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        events: {
          type: 'array',
          items: {
            $ref: 'Event#'
          }
        }
      }
    },

    DeviceLists: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        changed: {
          type: 'array',
          items: { type: 'string' }
        },
        left: {
          type: 'array',
          items: { type: 'string' }
        }
      }
    },

    Event: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        content: {
          type: 'object'
        },
        type: {
          type: 'string'
        }
      },
      required: ['content', 'type']
    },

    EventContent: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        avatar_url: {
          type: 'string'
        },
        displayname: {
          type: 'string'
        },
        is_direct: {
          type: 'boolean'
        },
        join_authorised_via_users_server: {
          type: 'string'
        },
        membership: {
          type: 'string',
          enum: ['invite', 'join', 'knock', 'leave', 'ban']
        },
        reason: {
          type: 'string'
        },
        third_party_invite: {
          type: 'Invite#'
        }
      },
      required: ['membership']
    },

    Invite: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        display_name: {
          type: 'string'
        }
      },
      required: ['display_name']
    },

    ClientEventWithoutRoomID: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        content: {
          type: 'object'
        },
        event_id: {
          type: 'string'
        },
        origin_server_ts: {
          type: 'number'
        },
        sender: {
          type: 'string'
        },
        state_key: {
          type: 'string'
        },
        type: {
          type: 'string'
        },
        unsigned: {
          type: 'object',
          properties: {
            age: {
              type: 'number'
            },
            prev_content: {
              type: 'EventContent#'
            },
            redacted_because: {
              type: 'ClientEventWithoutRoomID#'
            },
            transaction_id: {
              type: 'string'
            }
          }
        }
      },
      required: ['content', 'event_id', 'origin_server_ts',
        'sender', 'type']
    },

    StrippedStateEvent: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        content: {
          type: 'EventContent#'
        },
        sender: {
          type: 'string'
        },
        state_key: {
          type: 'string'
        },
        type: {
          type: 'string'
        }
      },
      required: ['content', 'sender', 'state_key', 'type']
    },

    InviteState: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        events: {
          type: 'array',
          items: { type: 'StrippedStateEvent#' }
        }
      }
    },

    InvitedRoom: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        invite_state: { type: 'InviteState#' }
      }
    },
    JoinedRoom: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        account_data: {
          type: 'AccountData#'
        },
        ephemeral: {
          type: 'Ephemeral#'
        },
        state: {
          type: 'State#'
        },
        summary: {
          type: 'RoomSummary#'
        },
        timeline: {
          type: 'Timeline#'
        },
        unread_notifications: {
          type: 'NotificationCounts#'
        },
        unread_thread_notifications: {
          type: 'object',
          patternProperties: {
            '^.': { type: 'NotificationCounts#' }
          }
        }
      }
    },
    KnockedRoom: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        knock_state: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: { type: 'StrippedStateEvent#' }
            }
          }
        }
      }
    },
    LeftRoom: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        account_data: {
          type: 'AccountData#'
        },
        state: {
          type: 'State#'
        },
        timeline: {
          type: 'Timeline#'
        }
      }
    },

    Ephemeral: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        events: {
          type: 'array',
          items: { type: 'Event#' }
        }
      }
    },

    State: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        events: {
          type: 'array',
          items: { type: 'ClientEventWithoutRoomID#' }
        }
      }
    },
    RoomSummary: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        'm.heroes': {
          type: 'array',
          items: { type: 'string' }
        },
        'm.invited_member_count': { type: 'number' },
        'm.joined_member_count': { type: 'number' }
      }
    },
    Timeline: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        events: {
          type: 'array',
          items: { type: 'ClientEventWithoutRoomID#' }
        },
        limited: {
          type: 'boolean'
        },
        prev_batch: {
          type: 'string'
        }
      },
      required: ['events']
    },
    NotificationCounts: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        highlight_count: { type: 'number' },
        notification_count: { type: 'number' }
      }
    },

    ToDevice: {
      $schema: 'http://json-schema.org/draft-07/schema#',
      properties: {
        events: {
          type: 'array',
          items: { type: 'Event#' }
        }
      }
    }
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
      }
    },
    required: [
      'errcode'
    ]
  }, parserOptions)

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

  export const GET_client_v3_sync = schemasafeParser({
    $schema: 'http://json-schema.org/draft-07/schema#',
    properties: {
      account_data: {
        $ref: 'AccountData#'
      },
      device_lists: {
        $ref: 'DeviceLists#'
      },
      device_one_time_keys_count: {
        type: 'object',
        patternProperties: {
          '^.': { type: 'number' }
        }
      },
      next_batch: {
        type: 'string'
      },
      presence: {
        $ref: 'Presence#'
      },
      rooms: {
        properties: {
          invite: {
            type: 'object',
            patternProperties: {
              '^.': { type: 'InvitedRoom#' }
            }
          },
          join: {
            type: 'object',
            patternProperties: {
              '^.': { type: 'JoinedRoom#' }
            }
          },
          knock: {
            type: 'object',
            patternProperties: {
              '^.': { type: 'KnockedRoom#' }
            }
          },
          leave: {
            type: 'object',
            patternProperties: {
              '^.': { type: 'LeftRoom#' }
            }
          }
        }
      },
      to_device: {
        type: 'ToDevice#'
      }
    },
    required: [
      'next_batch'
    ]
  }, parserOptions)
}

export default schema
