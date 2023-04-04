type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

type AResult<T, E = Error> = Promise<Result<T, E>>;