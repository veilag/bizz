import api from "@/api/index.ts";
import {Assistant, selectedAssistantAtom, userAssistantsAtom} from "@/atoms/assistant.ts";
import atomStore from "@/atoms";

interface AssistantRequest {
  name: string
  description: string
  code: string
  isDataAccessible: boolean
  username: string
}

const fetchAssistants = () => {
  return api.get<Assistant[]>("/assistants")
}

const fetchUserAssistants = () => {
  api.get<Assistant[]>("/assistants/user")
    .then(res => atomStore.set(userAssistantsAtom, res.data))
}

const getAssistantByID = (assistantID: number) => {
  return api.get<Assistant>(`/assistants/${assistantID}`)
}

const addNewAssistant = ({name, description, code, isDataAccessible, username}: AssistantRequest) => {
  return api.post<Assistant>("/assistants/add", {
    name,
    description,
    isDataAccessible,
    username,
    code
  })
}

const updateAssistant = (id: number, {name, description, code, isDataAccessible, username}: AssistantRequest) => {
  return api.patch<Assistant>(`/assistants/edit/${id}`, {
    name,
    description,
    code,
    isDataAccessible,
    username
  })
    .then(res => atomStore.set(selectedAssistantAtom, res.data))
}

const addAssistantToUser = (assistantID: number) => {
  return api.post(`/assistants/user/add/${assistantID}`)
}

const removeAssistantFromUser = (assistantID: number) => {
  return api.delete(`/assistants/user/remove/${assistantID}`)
}

export {
  fetchAssistants,
  fetchUserAssistants,
  addNewAssistant,
  addAssistantToUser,
  updateAssistant,
  removeAssistantFromUser,
  getAssistantByID
}
