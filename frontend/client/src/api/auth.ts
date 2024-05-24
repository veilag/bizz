import {TokenResponse} from "@/types/auth.ts";
import api from "@/api/index.ts";

interface LoginUserRequestData {
  username: string
  password: string
}

const loginUser = ({ username, password }: LoginUserRequestData) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);

  const request = api.post<TokenResponse>("/auth/login", params)
  console.log(request)
  return request
}

export {
  loginUser
}
