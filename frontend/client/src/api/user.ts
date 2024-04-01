import api from "@/api/index.ts";
import {User, userAtom} from "@/atoms/user.ts";
import atomStore from "@/atoms";

const fetchUserCredentials = () => {
  api.get<User>("/users/me")
    .then(res => {
      atomStore.set(userAtom, res.data)
    })
}

export {
  fetchUserCredentials
}
