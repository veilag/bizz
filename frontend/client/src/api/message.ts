import api from "@/api/index.ts";
import {Message} from "@/atoms/message.ts";

interface SendMessageRequest {
  content: string
  assistantID: number
  queryID: number
}

const sendMessage = ({content, assistantID, queryID}: SendMessageRequest) => {
  api.post<Message>("/message", {
    content,
    assistantID,
    queryID
  })
}

const sendMessageCallback = (queryID: number, messageID: number, assistantID: number, fetchersData: string | undefined, callbackData: string | undefined) => {
  api.post("/message/callback", {
    queryID,
    messageID,
    assistantID,
    fetchersData,
    callbackData
  })
}

const fetchMessage = (messageGroupID: number | undefined) => {
  return api.get<Message[]>(`/message/get/${messageGroupID}`)
}

const clearQueryMessages = (queryID: number, assistantID: number) => {
  return api.get(`/message/clear/${queryID}/${assistantID}`)
}

export {
  fetchMessage,
  sendMessage,
  sendMessageCallback,
  clearQueryMessages
}
