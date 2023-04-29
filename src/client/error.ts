export enum ErrorType {
  Network,
  InvalidJSON,
  MalformedJSON,
  RateLimited,
  Forbidden,
  NotFound,
  Unauthorized,

  Unsupported,
  Internal,
  InternalHTTP,

  InvalidToken,
  NoToken,
  UserDeactivated
}

export type Error =
  {
    type: ErrorType.Network
  } |
  {
    type: ErrorType.InvalidJSON
  } |
  {
    type: ErrorType.MalformedJSON
  } |
  {
    type: ErrorType.RateLimited,
    retryAfterMs: number
  } |
  {
    type: ErrorType.Forbidden
  } |
  {
    type: ErrorType.NotFound
  } |
  {
    type: ErrorType.Unauthorized
  } |

  {
    type: ErrorType.Unsupported
  } |
  {
    type: ErrorType.Internal,
    reason?: string
  } |
  {
    type: ErrorType.InternalHTTP
  } |

  {
    type: ErrorType.InvalidToken
    soft_logout?: boolean
  } |
  {
    type: ErrorType.NoToken
  } |
  {
    type: ErrorType.UserDeactivated
  }
