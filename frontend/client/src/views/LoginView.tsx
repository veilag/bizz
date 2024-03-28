import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx";
import {Loader} from "react-feather";
import {animated, useTransition} from "@react-spring/web";
import {QRCode} from "react-qrcode-logo";
import {useEffect, useState} from "react";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import useWebSocket from "react-use-websocket";
import {ConnectionMessage, StringPayload} from "@/types/socket.ts";
import {WS_URL} from "@/config.ts";
import {useNavigate} from "react-router-dom";
import axios from "axios";
import {TokenPayload, TokenResponse} from "@/types/auth.ts";
import {TelegramLogo} from "@/assets/icons";
import {toast} from "sonner";

const formSchema = z.object({
  username: z.string().min(6, {
    message: "Введите не менее 6 символов"
  }).max(30),

  password: z.string().min(8, {
    message: "Введите не менее 8 символов"
  })
})

const LoginView = () => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isCodeShowed, setCodeShowed] = useState<boolean>(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

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

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLoading(true)

    const params = new URLSearchParams();
    params.append('username', values.username);
    params.append('password', values.password);

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

          navigate("/list", {
            replace: true
          })
        }
      })
      .catch((error) => {
        setLoading(false)

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
      })
  }

  const handleLoginViaTelegram = async () => {
    if (isCodeShowed) {
      setCodeShowed(false)
      return
    }

    setCodeShowed(true)
    form.clearErrors()
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
    <div className="flex items-center justify-center w-full h-screen">
      <div className="w-96">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-4">
              <h2 className="font-bold text-lg">
                Авторизация
              </h2>
              <p className="text-muted-foreground text-sm">
                Войдите в систему BizzAI
              </p>
            </div>
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className={`${(isCodeShowed || isLoading) && 'text-muted-foreground'}`}>Имя пользователя</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <div className="w-12 flex text-muted-foreground justify-center items-center rounded-md border border-input">
                        @
                      </div>
                      <Input disabled={isCodeShowed || isLoading} type="text" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem className="mt-2">
                  <FormLabel className={`${(isCodeShowed || isLoading) && 'text-muted-foreground'}`}>Пароль</FormLabel>
                  <FormControl>
                    <Input disabled={isCodeShowed || isLoading} type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

            <div className="w-full flex gap-2 justify-center items-center mt-4">
              <Button disabled={isCodeShowed || isLoading} className="w-full" type="submit">{isLoading ? (<Loader className="animate-spin" />) : 'Авторизоваться'}</Button>
            </div>
          </form>
        </Form>
        <Button disabled={isLoading} onClick={() => handleLoginViaTelegram()} className="w-full mt-2 bg-blue-500 text-white hover:bg-blue-600">
          <TelegramLogo className="mr-2"/> Войти через Telegram
        </Button>
        <Button onClick={() => navigate("/signup")} className="w-full mt-2" variant="link">Зарегистрироваться</Button>
      </div>

      {transition((style, item) =>
          item && <animated.div style={style} className="w-80 relative">
                  <div className="overflow-hidden w-80">
                      <div className="mb-4">
                          <h2 className="font-bold text-lg">Отсканируйте QR-код</h2>
                          <p className="text-muted-foreground text-sm">Откройте @bizz_bot в Telegram для сканирования
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
