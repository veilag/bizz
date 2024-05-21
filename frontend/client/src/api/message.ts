import api from "@/api/index.ts";
import {Message, messageListAtom} from "@/atoms/message.ts";
import atomStore from "@/atoms";

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
  api.get<Message[]>(`/message/get/${messageGroupID}`)
    .then(res => {
      atomStore.set(messageListAtom, res.data)
    })
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
