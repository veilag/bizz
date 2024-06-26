import axios from "axios";

const authUserSession = (connectionID: string, safeDataString: string | undefined) => {
  return axios.post("../api/auth/login/telegram", {
    connectionId: connectionID,
    telegramAuth: safeDataString,
  })
}

export {
  authUserSession
}