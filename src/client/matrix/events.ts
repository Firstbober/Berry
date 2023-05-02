import { Json } from '@exodus/schemasafe'
import { Error } from '../error'
import ClientLocalData from './clientLocalData'
import endpoints from './endpoints'

/// Events class for functions related with event receiving and sending.
/// https://spec.matrix.org/v1.5/client-server-api/#syncing
export class events {
  async sync (clientData: ClientLocalData, since?: string, timeout = 30000): AResult<Json, Error> {
    const res = await endpoints.GET_client_v3_sync(
      clientData.providerInfo.homeserver,
      clientData.accessToken,
      {
        since,
        timeout
      }
    )

    return res
  }
}
