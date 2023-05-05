/// Here are all the cached values like rooms, spaces, etc.
export namespace cache {
    export interface ThumbnailInfo {
      w?: number,
      h?: number,
      mimetype?: string,
      size?: number
    }

    export interface ImageInfo extends ThumbnailInfo {
      thumbnailInfo?: ThumbnailInfo,
      thumbnailUrl?: string
    }

    export interface Room {
      type: 'any' | 'space',
      id: string,

      state: {
        name?: string,
        topic?: string,

        avatar?: {
          info: ImageInfo,
          url: string
        },

        pinnedEvents: string[],

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
          allow: {[roomID: string]: {
            type: 'm.room_membership'
          }}
        },

        members: { [id: string]: {
          avatarUrl?: string,
          displayName?: string,
          membership: 'invite' | 'join' | 'knock' | 'leave' | 'ban',
          thirdPartyInvite?: {
            displayName: string
          },
          powerLevel: number
        } },

        powerLevels: {
          changed: boolean,

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
          usersDefault: number,

          memberLevels: { [id: string]: number }
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
                allow: {}
              },

              members: {},

              powerLevels: {
                changed: false,

                ban: 50,
                events: {},
                eventsDefault: 0,
                invite: 0,
                kick: 50,
                notifications: {
                  room: 50
                },
                redact: 50,
                stateDefault: 0,
                usersDefault: 0,

                memberLevels: {}
              }
            }
          }
    }
  }
