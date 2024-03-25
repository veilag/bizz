import axios from "axios";

const checkAuthentication = async (unsafeData: string | undefined) => {
  try {
    const res = await axios.post("../auth/telegram/me", {
      telegramAuth: unsafeData
    })

    return res.data

  } catch (e) {
    return undefined
  }
}

export {
  checkAuthentication
}