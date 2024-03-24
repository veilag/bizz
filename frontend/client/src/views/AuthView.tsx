import {useRef} from "react";
import axios from "axios";
import useLocalStorage from "react-use-localstorage";
import {useNavigate} from "react-router-dom";

const AuthView = () => {
  const navigate = useNavigate()
  const [, setAccessToken] = useLocalStorage("access_token", "unauthorized")

  const username = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)

  const handleLogin = async () => {
    if (username.current === null || password.current == null) return

    const params = new URLSearchParams();
    params.append('username', username.current.value);
    params.append('password', password.current.value);

    axios.post("http://localhost:8000/auth/login", params)
      .then((response) => {
        if (response.status === 200) {
          setAccessToken(response.data.access_token)
          navigate("/")
        }
      })
  }

  return (
    <div>
      <h1>Auth</h1>
      <input type="text" placeholder="Username" ref={username}/>
      <input type="text" placeholder="Password" ref={password}/>
      <button onClick={() => handleLogin()}>Login</button>
    </div>
  )
}

export default AuthView
