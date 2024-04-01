import {useState} from "react";
import useWebSocket from "react-use-websocket";
import {ConnectionMessage} from "@/types/socket.ts";
import {WS_URL} from "@/config.ts";

const useConnection = () => {
  const [isError, setError] = useState<boolean>(false)
  const [isConnectionLost, setConnectionLost] = useState<boolean>(false)
  const {sendJsonMessage} = useWebSocket<ConnectionMessage>(
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

        const accessToken = localStorage.getItem("accessToken")
        if (!accessToken) return

        sendJsonMessage({
          event: "SUBSCRIBE_USER",
          payload: {
            data: accessToken
          }
        })
      },

      onReconnectStop: () => {
        setConnectionLost(false)
        setError(true)
      }
    }
  )

  return {
    isError, isConnectionLost
  }
}

export default useConnection
