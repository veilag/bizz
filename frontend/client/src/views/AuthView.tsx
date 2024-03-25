import {useEffect, useRef, useState} from "react";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {TokenPayload, TokenResponse} from "../types/auth.ts";
import useWebSocket from "react-use-websocket";
import {ConnectionMessage, StringPayload} from "../types/socket.ts";
import {WS_URL} from "../config.ts";
import {QRCode} from "react-qrcode-logo";
import {Label} from "@/components/ui/label.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx"
import {Loader, ArrowLeftCircle} from "react-feather";
import {animated, useTransition} from "@react-spring/web";

const AuthView = () => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isCodeShowed, setCodeShowed] = useState<boolean>(false)
  const transition = useTransition(isCodeShowed, {
    from: {
      margin: "0px 0px",
      width: "0px",
      transform: "scale(0.3)",
      opacity: 0
    },
    enter: {
      margin: "0px 20px",
      width: "320px",
      transform: "scale(1.0)",
      opacity: 1
    },
    leave: {
      width: "0px",
      margin: "0px 0px",
      transform: "scale(0.3)",
      opacity: 0
    }
  })

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
    setLoading(true)
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
    if (isCodeShowed) {
      setCodeShowed(false)
      return
    }

    setCodeShowed(true)

    setTimeout(() => {
      sendJsonMessage({
        "event": "AUTH_VIA_TELEGRAM",
        "payload": null
      })
    }, 1000)
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

        setCodeShowed(false)
        setTimeout(() => {
          navigate("/")
        }, 1000)

        break
    }

  }, [message]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-96 flex flex-col gap-4">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className={`${isCodeShowed && 'text-muted-foreground'}`} htmlFor="email">Никнейм</Label>
          <Input disabled={isCodeShowed} ref={username} type="email" id="email" placeholder="@username"/>
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label className={`${isCodeShowed && 'text-muted-foreground'}`} htmlFor="password">Пароль</Label>
          <Input disabled={isCodeShowed} ref={password} type="email" id="email" placeholder="password"/>
        </div>

        <div className="flex flex-col gap-2">
          <Button disabled={isCodeShowed} onClick={() => handleLogin()}>{isLoading ? <Loader className='animate-spin'/> : 'Авторизоваться'}</Button>
          <Button onClick={() => handleLoginViaTelegram()} className="bg-blue-500 text-white hover:bg-blue-600">
            <ArrowLeftCircle className={`mr-2 transition-all ease-in delay-300 ${isCodeShowed ? 'rotate-0' : 'rotate-180'}`} size={20}/> Войти через Telegram
          </Button>
        </div>
      </div>

      {transition((style, item) =>
          item && <animated.div style={style} className="w-80 relative">
                  <div className="overflow-hidden w-80">
                      <h2>Отсканируйте QR-код</h2>
                      <p className="text-muted-foreground text-sm">Откройте @bizz_bot в Telegram для сканирования кода для сканирования кода
                      </p>

                      <div className="overflow-clip rounded-2xl inline-block mt-3">
                        {connectionID !== "" && <QRCode size={250} eyeRadius={5} value={connectionID}/>}
                        {connectionID === "" &&
                            <div className="w-[270px] h-[270px] bg-white text-black flex justify-center items-center"><Loader
                                className="animate-spin"/></div>}
                      </div>
                  </div>
              </animated.div>
      )}
    </div>
  )
}

export default AuthView
