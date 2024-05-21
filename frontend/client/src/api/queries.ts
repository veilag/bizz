import api from "@/api/index.ts";
import {BusinessQuery} from "@/types/business.ts";

interface QueryGenerationRequestData {
  name: string
  description: string
}

const generateQuery = ({ name, description }: QueryGenerationRequestData) => {
  return api.post("/business/create", {
    name,
    description,
  })
}

const getQueryByID = (queryID: number) => {
  return api.get<BusinessQuery>(`/business/${queryID}`)
}

const fetchQueries = () => {
  return api.get<BusinessQuery[]>("/business/list")
}

const deleteQuery = (query_id: number) => {
  return api.get(`/business/delete/${query_id}`)
}

export {
  generateQuery,
  fetchQueries,
  getQueryByID,
  deleteQuery
}
