import {useEffect, useState} from "react";
import useWebSocket, {ReadyState} from "react-use-websocket";
import {ConnectionMessage} from "@/types/socket.ts";
import {WS_URL} from "@/config.ts";

const useConnection = () => {
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

  return {
    isError, isConnectionLost
  }
}

export default useConnection
