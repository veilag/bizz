import {
  MainButton,
  useHapticFeedback, useInitData,
  useScanQrPopup,
  useShowPopup,
  useWebApp
} from "@vkruglikov/react-telegram-web-app";
import axios from "axios";
import {Logo} from "@/assets/icons";
import helpSrc from '/assets/help.png';

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
    axios.post("../api/auth/telegram", {
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
    <div className="flex flex-col h-full w-full justify-between p-6">
      <div>
        <Logo className="w-32"/>

        <h1 className="text-2xl font-bold mt-4">Добро пожаловать</h1>
        <p className="leading-5">Для того, чтобы продолжить, привяжите аккаунт на сайте</p>
      </div>

      <img alt="help" src={helpSrc}/>

      <MainButton text="Привязать аккаунт" onClick={() => showQrPopup({
        text: "Отсканируйте QR-код на сайте"
      }, (connectionID) => {
        handleAccountLinking(connectionID, safeData)
      })}/>
    </div>
  )
}

export default LinkView
