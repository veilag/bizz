import {
  QueryStatusUpdatePayload,
  TokenPayload,
  QueryCreatedPayload,
  MessagePayload,
  AssistantMessageUpdatePayload
} from "@/types/payloads.ts";

interface StringPayload {
  data: string
}

interface ConnectionMessage {
  event: string
  payload: StringPayload | TokenPayload | QueryStatusUpdatePayload | QueryCreatedPayload | MessagePayload | AssistantMessageUpdatePayload
}

export type {
  ConnectionMessage,
  StringPayload
}
