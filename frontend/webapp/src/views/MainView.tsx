import {
  MainButton,
  useHapticFeedback,
  useInitData,
  useScanQrPopup,
  useShowPopup
} from "@vkruglikov/react-telegram-web-app";
import {authUserSession} from "@/api/auth.ts";

const MainView = () => {
  const [showQrPopup, closeQrPopup] = useScanQrPopup()
  const [impactOccurred, notificationOccurred,] = useHapticFeedback();
  const showPopup = useShowPopup()
  const [, safeData] = useInitData()

  function handleSuccessAuth() {
    notificationOccurred("success")
  }

  function handleErrorAuth(safeDataString: string | undefined) {
    impactOccurred("heavy")

    showPopup({
      message: "Во время авторизации произошла ошибка",
      buttons: [
        {
          id: "repeat",
          text: "Повторить"
        }
      ]
    }).then(() => {
      showQrPopup({
        text: "От сканируйте QR-код на сайте"
      }, (text) => {
        handleAuth(text, safeDataString)
      })
    })
  }
  
  function handleAuth(connectionID: string, safeDataString: string | undefined) {
    authUserSession(connectionID, safeDataString)
      .then(() => handleSuccessAuth())
      .catch(() => handleErrorAuth(safeDataString))
  }

  return (
    <div className="h-full w-full p-4">

      <MainButton
        onClick={() => {
          showQrPopup({ text: "От сканируйте QR-код на сайте" }, (connectionID) => {
            closeQrPopup()
            handleAuth(connectionID, safeData)
          })
        }}
        text="Авторизоваться на сайте"/>
    </div>
  )
}

export default MainView
