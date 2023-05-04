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
