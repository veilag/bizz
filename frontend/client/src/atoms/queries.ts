import {BusinessQuery} from "@/types/business.ts";
import {atom} from "jotai";

const queriesListAtom = atom<BusinessQuery[]>([])
const selectedQueryAtom = atom<BusinessQuery | undefined>(
  undefined,
)

export {
  queriesListAtom,
  selectedQueryAtom
}
