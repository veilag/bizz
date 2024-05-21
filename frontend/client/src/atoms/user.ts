import {atom} from "jotai";

export interface User {
  id: number
  isDeveloper: boolean
  username: string
  email: string
  selectedQueryID: number | undefined
  selectedAssistantID: number | undefined
}

const userAtom = atom<User | undefined>(undefined)

export {
  userAtom
}