import {TelegramLogo} from "@/assets/icons";
import ReactTimeAgo from "react-time-ago";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {useAtomValue} from "jotai/index";
import {messageListAtom} from "@/atoms/message.ts";
import {useEffect, useRef} from "react";
import useWebSocket from "react-use-websocket";
import {WS_URL} from "@/config.ts";
import {useAtom} from "jotai";
import {userAtom} from "@/atoms/user.ts";

const MessagesList = () => {
  const {lastJsonMessage} = useWebSocket(
    WS_URL, {
      share: true
    }
  )

  const scrollTargetRef = useRef<HTMLDivElement>(null)
  const user = useAtomValue(userAtom)
  const [messages, setMessages] = useAtom(messageListAtom)

  const scrollToLastMessage = () => {
    if (!scrollTargetRef.current) return

    scrollTargetRef.current.scrollIntoView({
      behavior: "smooth"
    })
  }

  useEffect(() => {
    if (!lastJsonMessage) return

    switch (lastJsonMessage.event) {
      case "NEW_MESSAGE":
        setMessages(prev => [
          ...prev,
          lastJsonMessage.payload.data
        ])
        break

      case "MESSAGE_UPDATE":
        console.log(lastJsonMessage)
        setMessages(prev => prev.map(message => {
          if (message.id === lastJsonMessage.payload.data.messageID) {
            console.log(message.id)
            return {
              ...message,
              content: message.content + lastJsonMessage.payload.data.content_update
            }
          }
          return message
        }))
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    scrollToLastMessage()
    console.log(messages)
  }, [messages]);

  return (
    <ScrollArea className="h-[calc(100vh-15rem)] break-words chat-panel-scroll">
      <div className="flex flex-col justify-end p-4 gap-5 break-words">
        {messages.map((message) => {
          return (
            <div key={message.id} className="break-words">
              <div
                className="flex items-center gap-1 text-muted-foreground dark:hover:text-white transition-all cursor-default">
                {message.fromTelegram && (
                  <div className="mr-1">
                    <TelegramLogo className="w-4 h-4"/>
                  </div>
                )}
                <div className="text-sm">{user?.id === message.userID ? 'Вы' : 'Ассистент'} {message.fromTelegram && 'через мессенджер'}</div>
                <div className="text-xs">• <ReactTimeAgo date={new Date(message.createdAt)}/></div>
              </div>
              <div className="text-sm mt-1 whitespace-pre-wrap break-words">
                {message.content}
              </div>
            </div>
          )
        })}
        <div className="mt-[-20px]" ref={scrollTargetRef}></div>
      </div>
    </ScrollArea>
  )
}

export default MessagesList
