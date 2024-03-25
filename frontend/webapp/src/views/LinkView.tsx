import {
  MainButton,
  useHapticFeedback, useInitData,
  useScanQrPopup,
  useShowPopup,
  useWebApp
} from "@vkruglikov/react-telegram-web-app";
import axios from "axios";

interface LinkViewProps {
  onSuccessLink: () => void
}

const LinkView = ({ onSuccessLink }: LinkViewProps) => {
  const [impactOccurred, notificationOccurred,] = useHapticFeedback();
  const [showQrPopup, closeQrPopup] = useScanQrPopup()
  const showPopup = useShowPopup()
  const [, safeData] = useInitData()
  const webApp = useWebApp()

  const handleAccountLinking = async (connectionID: string, safeDataString: string | undefined) => {
    axios.post("../auth/telegram", {
      connectionId: connectionID,
      telegramAuth: safeDataString,
    })
      .then(() => {
        notificationOccurred("success")
        closeQrPopup()
        onSuccessLink()

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
              type: "destructive",
              text: "Выйти"
            }
          ]
        }).then((buttonId) => {
          if (buttonId === "repeat") {
            showQrPopup({
              text: "Отсканируйте QR-код на сайте"
            }, (text) => {
              handleAccountLinking(text, safeDataString)
            })
          } else {
            webApp.close()
          }
        })
      })
  }

  return (
    <>
      <h1 className="text-xl">Привяжите аккаунт</h1>

      <MainButton text="Привязать аккаунт" onClick={() => showQrPopup({
        text: "Отсканируйте QR-код на сайте"
      }, (connectionID) => {
        handleAccountLinking(connectionID, safeData)
      })}/>
    </>
  )
}

export default LinkView
