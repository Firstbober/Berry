export enum ErrorType {
	Network,
	InvalidJSON,
	RateLimited,
	Unsupported
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
	} |
	{
		type: ErrorType.Unsupported
	}