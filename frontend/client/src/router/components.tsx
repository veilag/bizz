import {ReactNode} from "react";
import {Navigate} from "react-router-dom";

interface LoginSafeRouteProps {
  children: ReactNode
}

const LoginSafeRoute = ({children}: LoginSafeRouteProps) => {
  const accessToken = localStorage.getItem("accessToken")
  return accessToken !== null ? children : <Navigate to="/login" />
}

export {
  LoginSafeRoute
}