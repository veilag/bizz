import {atom} from "jotai";

export interface User {
  id: number
  username: string
  email: string
}

const userAtom = atom<User | undefined>(undefined)

export {
  userAtom
}