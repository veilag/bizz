import {RouterProvider} from "react-router-dom";
import router from "./router";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {useEffect, useState} from "react";
import {ConnectionMessage} from "./types/socket.ts";
import {WS_URL} from "./config.ts";
import {ThemeProvider} from "@/components/theme.tsx";
import {Loader} from "react-feather";

const App = () => {
  const [isError, setError] = useState<boolean>(false)
  const [isConnectionLost, setConnectionLost] = useState<boolean>(false)
  const {readyState, sendJsonMessage} = useWebSocket<ConnectionMessage>(
    WS_URL,
    {
      share: true,

      shouldReconnect: () => true,
      reconnectInterval: () => 5000,

      onError: () => {
        setConnectionLost(true)
      },

      onClose: () => {
        setConnectionLost(true)
      },

      onOpen: () => {
        setConnectionLost(false)
      },

      onReconnectStop: () => {
        setConnectionLost(false)
        setError(true)
      }
    }
  )

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken")

    if (readyState === ReadyState.OPEN) {
      if (accessToken !== null) {
        sendJsonMessage({
          event: "SUBSCRIBE_USER",
          payload: {
            data: accessToken
          }
        })
      }
    }

  }, [readyState, sendJsonMessage]);

  return (
    <ThemeProvider defaultTheme="system" storageKey="theme">
      {isConnectionLost && (
        <div className="flex items-center justify-center gap-2 py-1 bg-red-400 text-white dark:bg-red-500 w-full">
          <span className="text-sm">Соединение разорвано. Попытка переподключения</span>
          <Loader size={14} className="animate-spin"/>
        </div>
      )}

      {isError && (
        <div className="flex items-center dark:bg-white dark:text-black text-white justify-center gap-2 py-1 bg-black w-full">
          <span className="text-sm">Сервер не отвечает</span>
        </div>
      )}
      <RouterProvider router={router}/>
    </ThemeProvider>
  )
}

export default App
