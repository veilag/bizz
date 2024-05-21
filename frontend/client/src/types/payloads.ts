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

interface MessagePayload {
  data: {
    id: number,
    content: string
    queryID: number
    assistantName: string
    status: string

    userID: number
    assistantID: number
    logs: string

    isWidget: boolean
    isWidgetClosed: boolean
    forwardedID: number
    createdAt: number
    fromTelegram: boolean
  }
}

interface AssistantMessageUpdatePayload {
  data: {
    messageID: number
    contentUpdate: string
    logs: string
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
  QueryCreatedPayload,
  MessagePayload,
  AssistantMessageUpdatePayload
}
