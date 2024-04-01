import api from "@/api/index.ts";
import {BusinessQuery} from "@/types/business.ts";
import {queriesListAtom} from "@/atoms/queries.ts";
import atomStore from "@/atoms";

interface QueryGenerationRequestData {
  name: string
  query: string
  description: string
  city: string
}

const generateQuery = ({ name, query, description, city }: QueryGenerationRequestData) => {
  return api.post("/business/generate", {
    name,
    query,
    description,
    city
  })
}

const fetchQueries = () => {
  api.get<BusinessQuery[]>("/business/list")
    .then(res => {
      atomStore.set(queriesListAtom, res.data)
    })
}

export {
  generateQuery,
  fetchQueries
}
