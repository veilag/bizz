import {QueryStatusUpdatePayload, TokenPayload, QueryCreatedPayload} from "@/types/payloads.ts";

interface StringPayload {
  data: string
}

interface ConnectionMessage {
  event: string
  payload: StringPayload | TokenPayload | QueryStatusUpdatePayload | QueryCreatedPayload
}

export type {
  ConnectionMessage,
  StringPayload
}
