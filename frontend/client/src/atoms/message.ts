import {atom} from "jotai";

export interface Message {
  id: number
  userID: number | undefined
  assistantID: number | undefined
  forwardedID: number | undefined
  queryID: number
  status: string,

  isWidget: boolean
  isWidgetClosed: boolean
  logs: string | undefined

  assistantName: string

  createdAt: number
  fromTelegram: boolean
  content: string
}

const messageListAtom = atom<Message[]>([])

export {
  messageListAtom
}
