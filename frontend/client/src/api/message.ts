import api from "@/api/index.ts";
import {Message, messageListAtom} from "@/atoms/message.ts";
import atomStore from "@/atoms";

interface SendMessageRequest {
  content: string
  messageGroupID: number
}

const sendMessage = ({content, messageGroupID}: SendMessageRequest) => {
  api.post<Message>("/message", {
    content,
    messageGroupID
  })
    .then(res => {
      atomStore.set(messageListAtom, prev => [
        ...prev,
        {
          id: res.data.id,
          userID: res.data.userID,
          forwardedID: res.data.forwardedID,

          createdAt: res.data.createdAt,
          fromTelegram: res.data.fromTelegram,
          content: res.data.content
        }
      ])
    })
}

const fetchMessage = (messageGroupID: number | undefined) => {
  api.get<Message[]>(`/message/get/${messageGroupID}`)
    .then(res => {
      atomStore.set(messageListAtom, res.data)
    })
}

export {
  fetchMessage,
  sendMessage
}
