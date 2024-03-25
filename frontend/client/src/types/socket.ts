import {TokenPayload} from "./auth.ts";

interface StringPayload {
  data: string
}

interface ConnectionMessage {
  event: string
  payload: StringPayload | TokenPayload
}

export type {
  ConnectionMessage,
  StringPayload
}
