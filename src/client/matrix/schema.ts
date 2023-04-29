/* eslint-disable camelcase */
import { parser as schemasafeParser, ValidatorOptions } from '@exodus/schemasafe'

const parserOptions: ValidatorOptions = {
  mode: 'default',
  requireValidation: false,
  complexityChecks: true,
  includeErrors: !import.meta.env.PROD,
  schemas: {
    AccountData: {
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

    Invite: {
      properties: {
        display_name: {
          type: 'string'
        }
      },
      required: ['display_name']
    },

    ClientEventWithoutRoomID: {
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
              type: 'object'
            },
            redacted_because: {
              $ref: 'ClientEventWithoutRoomID#'
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
      properties: {
        content: {
          type: 'object'
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
      properties: {
        events: {
          type: 'array',
          items: { $ref: 'StrippedStateEvent#' }
        }
      }
    },

    InvitedRoom: {
      properties: {
        invite_state: { $ref: 'InviteState#' }
      }
    },
    JoinedRoom: {
      properties: {
        account_data: {
          $ref: 'AccountData#'
        },
        ephemeral: {
          $ref: 'Ephemeral#'
        },
        state: {
          $ref: 'State#'
        },
        summary: {
          $ref: 'RoomSummary#'
        },
        timeline: {
          $ref: 'Timeline#'
        },
        unread_notifications: {
          $ref: 'NotificationCounts#'
        },
        unread_thread_notifications: {
          type: 'object',
          patternProperties: {
            '^.': { $ref: 'NotificationCounts#' }
          }
        }
      }
    },
    KnockedRoom: {
      properties: {
        knock_state: {
          type: 'object',
          properties: {
            events: {
              type: 'array',
              items: { $ref: 'StrippedStateEvent#' }
            }
          }
        }
      }
    },
    LeftRoom: {
      properties: {
        account_data: {
          $ref: 'AccountData#'
        },
        state: {
          $ref: 'State#'
        },
        timeline: {
          $ref: 'Timeline#'
        }
      }
    },

    Ephemeral: {
      properties: {
        events: {
          type: 'array',
          items: { $ref: 'Event#' }
        }
      }
    },

    State: {
      properties: {
        events: {
          type: 'array',
          items: { $ref: 'ClientEventWithoutRoomID#' }
        }
      }
    },
    RoomSummary: {
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
      properties: {
        events: {
          type: 'array',
          items: { $ref: 'ClientEventWithoutRoomID#' }
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
      properties: {
        highlight_count: { type: 'number' },
        notification_count: { type: 'number' }
      }
    },

    ToDevice: {
      properties: {
        events: {
          type: 'array',
          items: { $ref: 'Event#' }
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
              '^.': { $ref: 'InvitedRoom#' }
            }
          },
          join: {
            type: 'object',
            patternProperties: {
              '^.': { $ref: 'JoinedRoom#' }
            }
          },
          knock: {
            type: 'object',
            patternProperties: {
              '^.': { $ref: 'KnockedRoom#' }
            }
          },
          leave: {
            type: 'object',
            patternProperties: {
              '^.': { $ref: 'LeftRoom#' }
            }
          }
        }
      },
      to_device: {
        $ref: 'ToDevice#'
      }
    },
    required: [
      'next_batch'
    ]
  }, parserOptions)
}

export default schema
