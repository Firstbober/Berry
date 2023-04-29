/* eslint-disable camelcase */
import { Json, Parse } from '@exodus/schemasafe'
import { httpErrcode, matrixErrcode, mfetch } from '../common'
import schema from './schema'
import { Error, ErrorType } from '../error'

// Endpoint generator
function edG<
  Authorization extends string | void = void,
  QueryParams extends object | void = void,
  Body extends object | void = void
> (type: 'GET' | 'POST', path: string, endpointSchema: Parse) {
  return async (baseUrl: string, authorization: Authorization, queryParams: QueryParams, body: Body): AResult<Json, Error> => {
    const searchParams = new URLSearchParams()

    // Check if query params are required, if so, then add them to URLSearchParams.
    if (typeof queryParams == 'object') {
      for (const [key, val] of Object.entries(queryParams)) {
        if (val != undefined) searchParams.set(key, String(val))
      }
    }

    // Make a request according to the template.
    const res = await mfetch(`${baseUrl}${path}?` + searchParams.toString(), {
      method: type,
      headers: {
        'Content-Type': 'application/json',
        Authorization: typeof authorization == 'string' ? `Bearer ${authorization}` : undefined
      },
      body: typeof body == 'object' ? JSON.stringify(body) : undefined
    })

    // Handle generic network error.
    if (res.ok == false) return res

    // Check for HTTP status from 400 to 499.
    if (res.value.status >= 400 && res.value.status < 500) {
      const pres = schema.response_error(await res.value.text())
      if (!pres.valid) return { ok: false, error: httpErrcode(res.value.status) }

      return { ok: false, error: matrixErrcode(pres.value as object) }
    }

    // Check for HTTP status from 500 to 599.
    if (res.value.status >= 500 && res.value.status < 600) {
      return { ok: false, error: { type: ErrorType.InternalHTTP } }
    }

    // Verify schema
    const text = await res.value.text()
    const pres = endpointSchema(text)
    if (!pres.valid) {
      console.error(`'${path}' endpoint failed; content:`, pres.errors || text)
      console.error(text)

      return {
        ok: false,
        error: { type: ErrorType.InvalidJSON }
      }
    }

    return { ok: true, value: pres.value }
  }
}

namespace endpoints {
  export const GET_client_v3_sync = edG<
    string,
    {
      filter?: string,
      full_state?: boolean,
      set_presence?: 'offline' | 'online' | 'unavailable',
      since?: string,
      timeout?: number
    }
  >('GET', '/_matrix/client/v3/sync', schema.GET_client_v3_sync)

  export const POST_client_v3_refresh = edG<
    void,
    void,
    {
      refresh_token: string
    }
  >('POST', '/_matrix/client/v3/refresh', schema.POST_client_v3_refresh)
}

export default endpoints
