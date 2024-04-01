import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {CornerRightUp} from "react-feather";
import {KeyboardEvent, useEffect, useRef, useState} from "react";
import {toast} from "sonner";
import {sendMessage} from "@/api/message.ts";
import {useAtomValue} from "jotai/index";
import {selectedQueryAtom} from "@/atoms/queries.ts";

const ChatForm = () => {

  const selectedQuery = useAtomValue(selectedQueryAtom)
  const messageInputRef = useRef<HTMLInputElement>(null)
  const [isInputValid, setInputValid] = useState<boolean>(false)

  const handleUserMessage = () => {
    if (!messageInputRef.current) return
    if (!selectedQuery) return;

    if (!isInputValid) {
      messageInputRef.current.focus()
      toast.warning("Введите сообщение не короче 6 символов")
      return
    }

    setInputValid(false)
    sendMessage({
      content: messageInputRef.current.value,
      messageGroupID: selectedQuery?.messageGroupID
    })

    messageInputRef.current.value = ""
    messageInputRef.current.blur()
  }

  const handleMessageInputChange = () => {
    if (!messageInputRef.current) return
    setInputValid(messageInputRef.current.value.length > 5)
  }

  const handleMessageEnter = (event: React.KeyboardEvent) => {
    if (event.code === "Enter") {
      handleUserMessage()
    }
  }

  useEffect(() => {
    const focusListener = () => {
      if (!messageInputRef.current) return
      messageInputRef.current.focus()
    }

    window.addEventListener("keyup", focusListener)

    return () => {
      window.removeEventListener("keyup", focusListener)
    }
  }, [])

  return (
    <div className="relative">
      {/*<div*/}
      {/*  className="absolute top-0 left-0 overflow-hidden h-[3px] w-full before:absolute*/}
      {/*             before:left-[-50%] before:h-[3px] before:w-1/3 before:bg-blue-400 before:animate-line-loader"></div>*/}

      <div className="flex items-end gap-2 p-4">
        <div className="flex flex-col flex-1 gap-2">
          <div className="flex gap-2">
            <div className="h-5 w-5 text-center items-center text-muted-foreground text-xs border rounded">/</div>
            <span className="text-xs text-muted-foreground mt-[1px]">Для фокуса поля ввода</span>
          </div>
          <Input
            tabIndex={0}
            onChange={() => handleMessageInputChange()}
            onKeyDown={(event) => handleMessageEnter(event)}
            ref={messageInputRef}
            placeholder="Введите запрос"
          />
        </div>
        <Button
          disabled={!isInputValid}
          onClick={() => handleUserMessage()}
          variant="outline"
          size="icon"
        >
          <CornerRightUp size={18}/>
        </Button>
      </div>
    </div>
  )
}

export default ChatForm
