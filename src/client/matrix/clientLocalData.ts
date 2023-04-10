import { ProviderInfo } from '../common'

interface ClientLocalData {
  id: number,
  finalized: boolean,
  active: boolean,

  providerInfo?: ProviderInfo,

  accessToken: string,
  deviceID: string,
  userID: string,

  expiresInMs?: number,
  refreshToken?: string,
}

export default ClientLocalData
