import {
  useExpand,
  useHapticFeedback,
  useInitData,
  useScanQrPopup,
  useShowPopup, useWebApp
} from "@vkruglikov/react-telegram-web-app";
import {useEffect} from "react";
import axios from "axios";

const App = () => {
  const [, expand] = useExpand()
  const [showQrPopup, closeQrPopup] = useScanQrPopup()
  const [unsafeData, safeData] = useInitData()
  const [impactOccurred, notificationOccurred,] = useHapticFeedback();
  const webApp = useWebApp()
  const showPopup = useShowPopup()

  const handleAuth = async (authID: string, safeDataString: string | undefined) => {
    if (safeDataString === undefined) return

    axios.post("../auth/telegram", {
      auth_id: authID,
      telegram_auth: safeDataString,
    })
      .then(() => {
        notificationOccurred("success")
        closeQrPopup()
        webApp.close()

      })
      .catch(() => {
        impactOccurred("heavy")
        closeQrPopup()

        showPopup({
          message: "Во время авторизации произошла ошибка",
          buttons: [
            {
              id: "repeat",
              text: "Повторить"
            },
            {
              id: "close",
              text: "Выйти"
            }
          ]
        }).then((buttonId) => {
          if (buttonId === "repeat") {
            showQrPopup({
              text: "Отсканируйте QR-код на сайте"
            }, (text) => {
              handleAuth(text, safeDataString)
            })
          } else {
            webApp.close()
          }
        })
      })
  }

  useEffect(() => {
    expand()
  }, []);

  if (unsafeData === undefined) {
    return (
      <div>
        <p>Please, open webapp inside of Telegram App</p>
      </div>
    )
  }

  return (
    <div>
      WebApp

      <button onClick={() => showQrPopup({
        text: "Отсканируйте QR-код на сайте"
      }, (text) => {
        handleAuth(text, safeData)
      })}>Auth</button>
    </div>
  )
}

export default App
