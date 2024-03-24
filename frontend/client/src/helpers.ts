import useLocalStorage from "react-use-localstorage";

const useAuthentication = () => {
  const [accessToken, ] = useLocalStorage("access_token", "unauthorized")
  return accessToken !== "unauthorized";
}

export {
  useAuthentication
}