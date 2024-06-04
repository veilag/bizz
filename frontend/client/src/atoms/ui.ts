import {atom} from "jotai";

const businessListShowedAtom = atom<boolean>(true)
const navigationShowedAtom = atom<boolean>(true)

export {
  businessListShowedAtom,
  navigationShowedAtom
}
