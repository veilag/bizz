import {useAuthentication} from "../helpers.ts";
import {ReactNode} from "react";
import {Navigate} from "react-router-dom";

interface LoginSafeRouteProps {
  children: ReactNode
}

const LoginSafeRoute = ({children}: LoginSafeRouteProps) => {
  const isAuthorized = useAuthentication()
  return isAuthorized ? children : <Navigate to="/auth" />
}

export {
  LoginSafeRoute
}