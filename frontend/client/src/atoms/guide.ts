import {atom} from "jotai";

const guideStateAtom = atom("")
const guideShowed = atom(false)

export {
  guideShowed,
  guideStateAtom
}