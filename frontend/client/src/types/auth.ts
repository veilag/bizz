interface TokenResponse {
  accessToken: string,
  refreshToken: string
}

interface TokenPayload {
  data: {
    accessToken: string
    refreshToken: string
  }
}

export type {
  TokenResponse,
  TokenPayload
}
