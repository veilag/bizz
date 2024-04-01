import {atom} from "jotai";

export interface Message {
  id: number
  userID: number | undefined
  forwardedID: number | undefined

  createdAt: number
  fromTelegram: boolean
  content: string
}

const messageListAtom = atom<Message[]>([])

export {
  messageListAtom
}
