import useWebSocket from "react-use-websocket";
import {ConnectionMessage, StringPayload} from "@/types/socket.ts";
import {WS_URL} from "@/config.ts";
import {useEffect, useState} from "react";
import {QRCode} from "react-qrcode-logo";
import {Button} from "@/components/ui/button.tsx";
import {Loader} from "react-feather";
import {TelegramLogo} from "@/assets/icons";
import {Dialog, DialogContent} from "@/components/ui/dialog.tsx";
import {toast} from "sonner";

interface TelegramLinkingAlertProps {
  open: boolean
  onLink: (result: boolean) => void
  onClose: () => void
}

const TelegramLinkingDialog = ({open, onLink, onClose }: TelegramLinkingAlertProps) => {
  const [connectionID, setConnectionID] = useState<string>("")
  const [isLoading, setLoading] = useState<boolean>(false)

  const {lastJsonMessage: message, sendJsonMessage} = useWebSocket<ConnectionMessage>(
    WS_URL,
    {
      share: true,
      shouldReconnect: () => true
    }
  )

  useEffect(() => {
    if (!open) return

    const accessToken = localStorage.getItem("accessToken")
    setLoading(true)

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
  }, [open, sendJsonMessage]);

  useEffect(() => {
    if (message === null || message === undefined) return

    switch (message.event) {
      case "TELEGRAM_QR_CODE_ACCESS":
        setConnectionID((message.payload as StringPayload).data)
        setLoading(false)
        break

      case "SUCCESSFUL_TELEGRAM_LINK":
        onLink(true)
        toast.success("Telegram аккаунт успешно привязан", {
          classNames: {
            toast: "w-fit"
          }
        })
        break
    }

  }, [message]);

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-none w-auto flex content-stretch items-stretch p-6">
        <div className="flex flex-col justify-between items-start my-2 mr-4">
          <div className="flex gap-5 items-center justify-center">
            <TelegramLogo className="w-12 h-12"/>
            <div>
              <h2 className="font-semibold">Привяжите Telegram аккаунт</h2>
              <p className="text-muted-foreground text-sm">Откройте бота <a target="_blank" className="underline" href="https://t.me/b1zz_bot">@b1zz_bot</a> <br/> и отсканируйте код, открыв "Меню"</p>
            </div>
          </div>
          <Button onClick={() => onClose()} className="w-full">Закрыть</Button>
        </div>
        <div className="flex flex-col">
          {!isLoading && (
            <div className="overflow-clip rounded-md w-min">
              <QRCode value={connectionID} size={250} eyeRadius={5} />
            </div>
          )}
          {isLoading && (
            <div className="text-black flex justify-center items-center w-[270px] h-[270px] rounded bg-white">
              <Loader size={35} className="animate-spin"/>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default TelegramLinkingDialog
