export enum ErrorType {
	Network,
	InvalidJSON,
	RateLimited
}

export type Error =
	{
		type: ErrorType.Network
	} |
	{
		type: ErrorType.InvalidJSON
	} |
	{
		type: ErrorType.RateLimited,
		retryAfterMs: number
	}