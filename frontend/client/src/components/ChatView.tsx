import {TelegramLogo} from "@/assets/icons";
import ReactTimeAgo from "react-time-ago";
import {Button} from "@/components/ui/button.tsx";
import {CornerRightUp} from "react-feather";
import {Separator} from "@/components/ui/separator.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useEffect, useRef, useState} from "react";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {toast} from "sonner";


export interface Message {
  id: number
  sender: "me" | "assistant"
  senderName: string | undefined
  createdAt: number | Date
  content: string
  fromTelegram: boolean
}

const ChatView = () => {
  const scrollTargetRef = useRef<HTMLDivElement>(null)
  const messageInputRef = useRef<HTMLInputElement>(null)
  const [isInputValid, setInputValid] = useState<boolean>(false)
  const [messages, setMessages] = useState<Message[]>([])

  const scrollToLastMessage = () => {
    if (!scrollTargetRef.current) return

    scrollTargetRef.current.scrollIntoView({
      behavior: "smooth"
    })
  }

  const handleUserMessage = () => {
    if (!messageInputRef.current) return
    if (!isInputValid) {
      toast.warning("Введите сообщение не короче 6 символов")
      return
    }

    setInputValid(false)
    const messageContent = messageInputRef.current.value

    setMessages(prev => ([
      ...prev,
      {
        id: new Date().getTime(),
        sender: "me",
        senderName: undefined,
        createdAt: new Date(),
        content: messageContent,
        fromTelegram: false
      }
    ]))

    messageInputRef.current.value = ""
  }

  const handleMessageEnter = (event: React.KeyboardEvent) => {
    if (event.code === "Enter") {
      handleUserMessage()

      if (!messageInputRef.current) return
      messageInputRef.current.blur()
    }
  }

  const validateMessageInput = () => {
    if (!messageInputRef.current) return
    setInputValid(messageInputRef.current.value.length > 5)
  }

  const handleMessageInputChange = () => {
    validateMessageInput()
  }

  useEffect(() => {
    const keyDownListener = (event: KeyboardEvent) => {
      if (!messageInputRef.current) return

      if (event.key === "." || event.key === "/") {
        messageInputRef.current.focus()
        scrollToLastMessage()
      }
    }

    addEventListener("keyup", keyDownListener)

    return () => {
      removeEventListener("keyup", keyDownListener)
    }
  }, []);



  useEffect(() => {
    scrollToLastMessage()
  }, [messages]);

  useEffect(() => {
    const chatPanelScrollView = document.querySelector('.chat-panel-scroll')
    if (!chatPanelScrollView) return
    chatPanelScrollView.getElementsByTagName("div")[1].style.display = "block"
  }, [])

  return (
      <div className="flex flex-col flex-1">
        <ScrollArea className="h-[calc(100vh-14rem)] break-words chat-panel-scroll">
          <div className="flex flex-col justify-end p-4 gap-5 break-words">
            {messages.map((message) => {
              if (message.sender === "me") {
                return (
                  <div className="break-words">
                    <div
                      className="flex items-center gap-1 text-muted-foreground dark:hover:text-white transition-all cursor-default">
                      {message.fromTelegram && (
                        <div className="mr-1">
                          <TelegramLogo className="w-4 h-4"/>
                        </div>
                      )}
                      <div className="text-sm">Вы {message.fromTelegram && 'через мессенджер'}</div>
                      <div className="text-xs">• <ReactTimeAgo date={message.createdAt}/></div>
                    </div>
                    <div className="text-sm mt-1 break-words">
                      {message.content}
                    </div>
                  </div>
                )
              }
            })}
            <div className="mt-[-20px]" ref={scrollTargetRef}></div>
          </div>
        </ScrollArea>

        <Separator/>
        <div className="p-2 flex items-end gap-2">
          <div className="flex w-full gap-2">
            <Button variant="secondary">
              Bizzy
            </Button>
            <Button variant="outline">
              Bizzy - Финансовый помощник
            </Button>
          </div>
        </div>
        <Separator orientation="horizontal"/>
        <div className="p-4 flex items-end gap-2">
          <div className="flex flex-col flex-1 gap-2">
            <div className="flex gap-2">
              <div className="h-5 w-5 text-center items-center text-muted-foreground text-xs border rounded">/</div>
              <span className="text-xs text-muted-foreground mt-[1px]">Для фокуса поля ввода</span>
            </div>
            <Input tabIndex={0} onChange={() => handleMessageInputChange()} onKeyDown={(event) => handleMessageEnter(event)} ref={messageInputRef} placeholder="Введите запрос"/>
          </div>
          <Button disabled={!isInputValid} onClick={() => handleUserMessage()} variant="outline" size="icon"><CornerRightUp size={18}/></Button>
        </div>
      </div>
  )
}

export default ChatView
