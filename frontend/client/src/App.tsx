import {RouterProvider} from "react-router-dom";
import router from "./router";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {useEffect} from "react";
import {ConnectionMessage} from "./types/socket.ts";
import {WS_URL} from "./config.ts";
import {ThemeProvider} from "@/components/theme.tsx";

const App = () => {
  const {readyState, sendJsonMessage} = useWebSocket<ConnectionMessage>(
    WS_URL,
    {
      share: true,
      shouldReconnect: () => false
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
    <ThemeProvider defaultTheme="dark" storageKey="theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  )
}

export default App
