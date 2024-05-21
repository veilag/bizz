import {atom} from "jotai";

export interface Assistant {
  id: number
  name: string
  username: string
  isDataAccessible: boolean
  htmlTemplate: string
  plainTemplate: string
  createdBy: number
  description: string
  code: string
}

const assistantsAtom = atom<Assistant[]>([])
const selectedAssistantAtom = atom<Assistant | undefined>(undefined)

const userAssistantsAtom = atom<Assistant[]>([])
const selectedUserAssistantAtom = atom<Assistant | undefined>(undefined)

export {
  assistantsAtom,
  userAssistantsAtom,
  selectedAssistantAtom,
  selectedUserAssistantAtom
}
