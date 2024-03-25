import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {TokenPayload, TokenResponse} from "../types/auth.ts";
import useWebSocket from "react-use-websocket";
import {ConnectionMessage, StringPayload} from "../types/socket.ts";
import {WS_URL} from "../config.ts";
import {QRCodeCanvas} from "qrcode.react";

const AuthView = () => {
  const [connectionID, setConnectionID] = useState<string>("")
  const {lastJsonMessage: message, sendJsonMessage} = useWebSocket<ConnectionMessage>(
    WS_URL,
    {
      share: true
    }
  )

  const navigate = useNavigate()

  const username = useRef<HTMLInputElement>(null)
  const password = useRef<HTMLInputElement>(null)

  const handleLogin = async () => {
    if (username.current === null || password.current == null) return

    const params = new URLSearchParams();
    params.append('username', username.current.value);
    params.append('password', password.current.value);

    axios.post<TokenResponse>("http://localhost:8000/auth/login", params)
      .then((response) => {
        if (response.status === 200) {
          localStorage.setItem("accessToken", response.data.accessToken)
          localStorage.setItem("refreshToken", response.data.refreshToken)

          sendJsonMessage({
            event: "SUBSCRIBE_USER",
            payload: {
              data: response.data.accessToken
            }
          })

          navigate("/")
        }
      })
  }

  const handleLoginViaTelegram = async () => {
    sendJsonMessage({
      "event": "AUTH_VIA_TELEGRAM",
      "payload": null
    })
  }

  useEffect(() => {
    if (message === null || message === undefined) return

    switch (message.event) {
      case "TELEGRAM_QR_CODE_ACCESS":
        setConnectionID((message.payload as StringPayload).data)
        break

      case "ACCESS_TOKEN_ACCEPT":
        localStorage.setItem("accessToken", (message.payload as TokenPayload).data.accessToken)
        localStorage.setItem("refreshToken", (message.payload as TokenPayload).data.refreshToken)

        sendJsonMessage({
          event: "SUBSCRIBE_USER",
          payload: {
            data: (message.payload as TokenPayload).data.accessToken
          }
        })
        navigate("/")

        break
    }

  }, [message]);

  return (
    <div>
      <h1>Auth</h1>
      <input type="text" placeholder="Username" ref={username}/>
      <input type="text" placeholder="Password" ref={password}/>

      <button onClick={() => handleLogin()}>Login</button>
      <button onClick={() => handleLoginViaTelegram()}>Auth via Telegram</button>

      <QRCodeCanvas value={connectionID}/>
    </div>
  )
}

export default AuthView
