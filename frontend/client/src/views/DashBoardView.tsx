import useWebSocket from "react-use-websocket";
import {useEffect, useState} from "react";
import {WS_URL} from "../config.ts";
import {ConnectionMessage} from "../types/socket.ts";
import {QRCode} from "react-qrcode-logo";

const DashBoardView = () => {
  const [connectionID, setConnectionID] = useState<string>("")
  const {lastJsonMessage: message, sendJsonMessage} = useWebSocket<ConnectionMessage>(
    WS_URL,
    {
      share: true
    }
  )

  const handleTelegramAuth = () => {
    const accessToken = localStorage.getItem("accessToken")

    sendJsonMessage({
      event: "LINK_TELEGRAM_ACCOUNT",
      payload: {
        data: accessToken
      }
    })
  }

  useEffect(() => {
    if (message === null || message === undefined) return

    switch (message.event) {
      case "TELEGRAM_QR_CODE_ACCESS":
        setConnectionID(message.payload.data as string)
        break

      case "SUCCESSFUL_TELEGRAM_LINK":
        // ...
        console.log("Telegram account linked to user account")
        break
    }

  }, [message]);

  return (
    <div>
      <h1>DashBoardView</h1>

      <button onClick={() => handleTelegramAuth()}>
        Link telegram
      </button>

      <QRCode value={connectionID}/>
    </div>
  )
}

export default DashBoardView
