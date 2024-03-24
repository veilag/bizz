import useWebSocket from "react-use-websocket";
import {useEffect, useState} from "react";
import useLocalStorage from "react-use-localstorage";
import {QRCodeCanvas} from "qrcode.react";

const DashBoardView = () => {
  const [authId, setAuthId] = useState<string>("")

  const [accessToken, ] = useLocalStorage("access_token")
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(`ws://localhost:8000/auth/ws/${accessToken}`)

  useEffect(() => {
    if (lastJsonMessage === null || lastJsonMessage === undefined) return
    setAuthId(lastJsonMessage.auth_id)

  }, [lastJsonMessage]);

  return (
    <div>
      DashBoardView
      <QRCodeCanvas value={authId} />
    </div>
  )
}

export default DashBoardView
