import { getClientDisplayName, matrixErrcode, mfetch } from '../common'
import { Error, ErrorType } from '../error'
import schema from './schema'

/// Account class for encapsulating account related functions.
export class account {
  /// Get supported login flows https://spec.matrix.org/v1.5/client-server-api/#authentication-types.
  async loginGetFlows (homeserver: string): AResult<string[], Error> {
    const req = await mfetch(`${homeserver}/_matrix/client/v3/login`)
    if (req.ok == false) return req

    if (req.value.status == 429) {
      const pres = schema.response_error(await req.value.text())
      return {
        ok: false,
        error: pres.valid
          ? matrixErrcode(pres.value as object)
          : {
              type: ErrorType.RateLimited,
              retryAfterMs: 2000
            }
      }
    }

    if (req.value.status != 200) {
      return {
        ok: false,
        error: { type: ErrorType.Network }
      }
    }

    const pres = schema.GET_client_v3_login(await req.value.text())
    if (!pres.valid) {
      return {
        ok: false,
        error: { type: ErrorType.InvalidJSON }
      }
    }

    return {
      ok: true,
      value: (pres.value['flows'] as {type: string}[]).map((flow) => flow.type)
    }
  }

  /// https://spec.matrix.org/v1.5/client-server-api/#post_matrixclientv3login.
  async loginPassword (homeserver: string, username: string, password: string): AResult<{
    accessToken: string,
    deviceID: string,
    userID: string,

    expiresInMs?: number,
    refreshToken?: string,
    wellKnown_homeServer?: string,
    wellKnown_identityServer?: string
  }, Error> {
    // Send POST request to the home server.
    const res = await mfetch(`${homeserver}/_matrix/client/v3/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        identifier: {
          type: 'm.id.user',
          user: username
        },
        initial_device_display_name: getClientDisplayName(),
        password,
        refresh_token: true,
        type: 'm.login.password'
      })
    })
    if (res.ok == false) return res

    // Handle all documented errors, 400, 403 and 429.
    if (res.value.status >= 400 && res.value.status <= 429) {
      const pres = schema.response_error(await res.value.text())
      if (!pres.valid) return { ok: false, error: { type: ErrorType.InvalidJSON } }

      return { ok: false, error: matrixErrcode(pres.value as object) }
    }

    // Check if response is in check with the schema.
    const pres = schema.POST_client_v3_login(await res.value.text())
    if (!pres.valid) return { ok: false, error: { type: ErrorType.InvalidJSON } }

    // Check if response contains well_known object and extract home server url origin
    // as well as optionally identity server url origin.
    let homeServer: string | undefined
    let identityServer: string | undefined

    if (pres.value['well_known'] != undefined) {
      homeServer = new URL(pres.value['well_known']['m.homeserver']['base_url']).origin
      if (pres.value['well_known']['m.identity_server'] != undefined) { identityServer = new URL(pres.value['well_known']['m.identity_server']['base_url']).origin }
    }

    return {
      ok: true,
      value: {
        accessToken: pres.value['access_token'],
        deviceID: pres.value['device_id'],
        userID: pres.value['user_id'],

        expiresInMs: pres.value['expires_in_ms'],
        refreshToken: pres.value['refresh_token'],
        wellKnown_homeServer: homeServer,
        wellKnown_identityServer: identityServer
      }
    }
  }
}
