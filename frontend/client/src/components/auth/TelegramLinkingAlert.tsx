import {
  AlertDialog,
  AlertDialogContent,
} from "@/components/ui/alert-dialog.tsx";
import useWebSocket from "react-use-websocket";
import {ConnectionMessage, StringPayload} from "@/types/socket.ts";
import {WS_URL} from "@/config.ts";
import {useEffect, useState} from "react";
import {QRCode} from "react-qrcode-logo";
import {Button} from "@/components/ui/button.tsx";
import {Loader} from "react-feather";
import {TelegramLogo} from "@/assets/icons";

interface TelegramLinkingAlertProps {
  open: boolean
  onLink: () => void
  onClose: () => void
}

const TelegramLinkingAlert = ({open, onLink, onClose }: TelegramLinkingAlertProps) => {
  const [connectionID, setConnectionID] = useState<string>("")
  const [isLoading, setLoading] = useState<boolean>(false)

  const {lastJsonMessage: message, sendJsonMessage} = useWebSocket<ConnectionMessage>(
    WS_URL,
    {
      share: true
    }
  )

  useEffect(() => {
    if (!open) return

    const accessToken = localStorage.getItem("accessToken")
    setLoading(true)

    setTimeout(() => {
      sendJsonMessage({
        event: "SUBSCRIBE_USER",
        payload: {
          data: accessToken
        }
      })

      sendJsonMessage({
        "event": "LINK_TELEGRAM_ACCOUNT",
        "payload": null
      })
    }, 1000)
  }, [open]);

  useEffect(() => {
    if (message === null || message === undefined) return

    switch (message.event) {
      case "TELEGRAM_QR_CODE_ACCESS":
        setConnectionID((message.payload as StringPayload).data)
        setLoading(false)
        break

      case "SUCCESSFUL_TELEGRAM_LINK":
        onLink()
        break
    }

  }, [message]);

  return (
    <AlertDialog open={open}>
      <AlertDialogContent className="w-auto">
        <div className="flex justify-center items-center gap-6">
          <TelegramLogo className="w-12 h-12"/>
          <div>
            <h2 className="font-semibold">Привяжите Telegram аккаунт</h2>
            <p className="text-muted-foreground text-sm">Откройте бота <a target="_blank" className="underline" href="https://t.me/b1zz_bot">@b1zz_bot</a> <br/> и отсканируйте код через WebApp</p>
          </div>
        </div>
        {!isLoading && (
          <div className="overflow-clip rounded-md w-min">
            <QRCode value={connectionID} size={315} eyeRadius={5} />
          </div>
        )}

        {isLoading && (
          <div className="text-black flex justify-center items-center w-[335px] h-[335px] rounded bg-white">
            <Loader size={35} className="animate-spin"/>
          </div>
        )}
        <Button onClick={() => onClose()} className="w-full">Закрыть</Button>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default TelegramLinkingAlert
