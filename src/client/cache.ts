/// Here are all the cached values like rooms, spaces, etc.
export namespace cache {
    export interface Room {
      type: 'any' | 'space',
      id: string,

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

    export interface Space extends Room {
      type: 'space',
      rooms: Room
    }

    export const rooms: { [k: string]: Room } = {}

    /// If possible, get the room from the cache, or create
    /// a new one according to spec.
    export function getOrCreateRoom (id: string): Room {
      return Object.hasOwn(cache.rooms, id)
        ? cache.rooms[id]
        : {
            type: 'any',
            id,

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
    }
  }
