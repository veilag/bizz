import {BusinessQuery} from "@/types/business.ts";

interface QueryCreatedPayload {
  data: BusinessQuery
}

interface TokenPayload {
  data: {
    accessToken: string
    refreshToken: string
  }
}

interface QueryStatusUpdatePayload {
  data: {
    id: number
    status: string
  }
}

export type {
  TokenPayload,
  QueryStatusUpdatePayload,
  QueryCreatedPayload
}
