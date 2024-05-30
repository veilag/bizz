import api from "@/api/index.ts";
import {User} from "@/atoms/user.ts";

const fetchUserCredentials = () => {
  return api.get<User>("/users/me")
}

const updateUserSelectedAssistant = (assistantID: number) => {
  api.post("/business/selection/update/assistant", {
    "assistantID": assistantID
  })
}

const updateUserSelectedQuery = (queryID: number | null) => {
  api.post("/business/selection/update/query", {
    "queryID": queryID
  })
}

const shareDeveloperPermission = (username: string) => {
  return api.get(`/users/share/permission/${username}`)
}

export {
  fetchUserCredentials,

  updateUserSelectedAssistant,
  updateUserSelectedQuery,
  shareDeveloperPermission
}
