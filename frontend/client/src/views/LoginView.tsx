import {Button} from "@/components/ui/button.tsx";
import {Loader} from "react-feather";
import {animated, useTransition} from "@react-spring/web";
import {QRCode} from "react-qrcode-logo";
import {useEffect, useState} from "react";
import {z} from "zod";
import useWebSocket from "react-use-websocket";
import {ConnectionMessage, StringPayload} from "@/types/socket.ts";
import {WS_URL} from "@/config.ts";
import {useNavigate} from "react-router-dom";
import {AxiosError, AxiosResponse} from "axios";
import {TokenResponse} from "@/types/auth.ts";
import {TokenPayload} from "@/types/payloads.ts";
import {Logo, TelegramLogo} from "@/assets/icons";
import {toast} from "sonner";
import {loginUser} from "@/api/auth.ts";
import LoginForm from "@/components/forms/auth/LoginForm.tsx";
import {loginSchema} from "@/components/forms/auth/schema.ts";
import {useSetAtom} from "jotai";
import {guideStateAtom} from "@/atoms/guide.ts";
import AnimateIn from "@/components/ui/animate.ts";

const LoginView = () => {
  const setGuideState = useSetAtom(guideStateAtom)

  const [isLoading, setLoading] = useState<boolean>(false)
  const [isCodeShowed, setCodeShowed] = useState<boolean>(false)

  const navigate = useNavigate()
  const [connectionID, setConnectionID] = useState<string>("")
  const {lastJsonMessage: message, sendJsonMessage} = useWebSocket<ConnectionMessage>(
    WS_URL,
    {
      share: true,
      onError: () => {
        setConnectionID("")
      },

      onClose: () => {
        setConnectionID("")
      },

      onOpen: () => {
        sendJsonMessage({
          "event": "AUTH_VIA_TELEGRAM",
          "payload": null
        })
      },

      shouldReconnect: () => true
    }
  )

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

  const onSuccessLogin = (res: AxiosResponse<TokenResponse>) => {
    localStorage.setItem("accessToken", res.data.accessToken)
    localStorage.setItem("refreshToken", res.data.refreshToken)

    sendJsonMessage({
      event: "SUBSCRIBE_USER",
      payload: {
        data: res.data.accessToken
      }
    })

    navigate("/list", {
      replace: true
    })

    setGuideState("start")
  }

  const onErrorLogin = (error: AxiosError) => {
    switch (error.code) {
      case "ERR_BAD_REQUEST":
        toast.warning("Неправильный логин или пароль", {
          classNames: {
            toast: "w-fit"
          }
        })
        break

      case "ERR_NETWORK":
        toast.error("Сервер не отвечает")
        break
    }
  }

  const onSubmit = (values: z.infer<typeof loginSchema>) => {
    setLoading(true)

    loginUser({
      username: values.username,
      password: values.password
    })
      .then(res => onSuccessLogin(res))
      .catch(error => onErrorLogin(error))
      .finally(() => setLoading(false))
  }

  const handleLoginViaTelegram = async () => {
    if (isCodeShowed) {
      setCodeShowed(false)
      return
    }

    setCodeShowed(true)
  }

  useEffect(() => {
    if (message === null || message === undefined) return

    switch (message.event) {
      case "TELEGRAM_QR_CODE_ACCESS":
        setConnectionID((message.payload as StringPayload).data)
        break

      case "ACCESS_TOKEN_ACCEPT":
        setLoading(true)
        setCodeShowed(false)

        toast.success("Выполнен вход через Telegram")

        localStorage.setItem("accessToken", (message.payload as TokenPayload).data.accessToken)
        localStorage.setItem("refreshToken", (message.payload as TokenPayload).data.refreshToken)

        sendJsonMessage({
          event: "SUBSCRIBE_USER",
          payload: {
            data: (message.payload as TokenPayload).data.accessToken
          }
        })

        setTimeout(() => {
          navigate("/list")
        }, 1000)

        setGuideState("start")

        break
    }

  }, [message, sendJsonMessage]);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")
    if (accessToken !== null) navigate("/")

    sendJsonMessage({
      "event": "AUTH_VIA_TELEGRAM",
      "payload": null
    })
  }, []);

  return (
    <div className="flex items-center relative justify-center w-full h-screen">
      <div className="absolute w-full translate-y-[-50%] h-full flex justify-center gap-2 z-0">
        <div className="w-96 h-96 origin-right opacity-50 bg-red-500 animate-rotate-out blur-[100px]"></div>
        <div className="w-96 h-96 origin-left opacity-50 bg-purple-500 animate-rotate-in delay-1000 blur-[100px]"></div>
      </div>
      <div className="absolute w-full h-full flex justify-center items-start z-5">
        <Logo className="w-20 h-20 mt-10 duration-200 hover:cursor-pointer hover:scale-125 transition-all ease-out"/>
      </div>

      <div className="p-6 z-10">
        <div className="w-96">
          <LoginForm
            onSubmit={(data) => onSubmit(data)}
            isLoading={isLoading}
            isCodeShowed={isCodeShowed}/>
          <AnimateIn
            from="opacity-0 -translate-y-4"
            to="opacity-100 translate-y-0 translate-x-0"
            duration={300}
            delay={200}
          >
            <Button
              disabled={isLoading}
              onClick={() => handleLoginViaTelegram()}
              className="w-full mt-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              <TelegramLogo className="mr-2"/> Войти через Telegram
            </Button>
          </AnimateIn>
          <AnimateIn
            from="opacity-0 -translate-y-4"
            to="opacity-100 translate-y-0 translate-x-0"
            duration={300}
            delay={200}
          >
            <Button
              onClick={() => navigate("/signup")}
              variant="link"
              className="w-full mt-2"
            >
              Зарегистрироваться
            </Button>
          </AnimateIn>
        </div>
      </div>

      {transition((style, item) =>
          item && <animated.div style={style} className="w-80 relative">
                  <div className="overflow-hidden w-80">
                      <div className="mb-4">
                          <h2 className="font-bold text-lg">Отсканируйте QR-код</h2>
                          <p className="text-muted-foreground text-sm">Откройте <a target="_blank" className="underline"
                                                                                   href="https://t.me/b1zz_bot">@b1zz_bot</a> в
                              Telegram для сканирования
                              кода для
                              сканирования кода
                          </p>
                      </div>

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

export default LoginView
