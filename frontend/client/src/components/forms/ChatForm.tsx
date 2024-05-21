import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Chrome, CornerRightUp} from "react-feather";
import React, {useRef, useState} from "react";
import {toast} from "sonner";
import {sendMessage} from "@/api/message.ts";
import {useAtom, useAtomValue} from "jotai/index";
import {selectedQueryAtom} from "@/atoms/queries.ts";
import {Assistant, selectedUserAssistantAtom, userAssistantsAtom} from "@/atoms/assistant.ts";
import {DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuItem} from "@/components/ui/dropdown-menu.tsx";
import {updateUserSelectedAssistant} from "@/api/user.ts";
import {useNavigate} from "react-router-dom";
import {X} from "lucide-react";

const ChatForm = () => {
  const navigate = useNavigate()
  const [isMessageCommand, setMessageCommand] = useState<boolean>(false)
  const userAssistants = useAtomValue(userAssistantsAtom)
  const [selectedUserAssistant, setSelectedUserAssistant] = useAtom(selectedUserAssistantAtom)

  const selectedQuery = useAtomValue(selectedQueryAtom)
  const messageInputRef = useRef<HTMLInputElement>(null)
  const [isInputValid, setInputValid] = useState<boolean>(false)

  const handleUserMessage = () => {
    if (!messageInputRef.current) return
    if (!selectedQuery) return
    if (!selectedUserAssistant) return

    if (!isInputValid) {
      messageInputRef.current.focus()
      toast.warning("Введите сообщение не короче 6 символов")
      return
    }

    setMessageCommand(false)
    setInputValid(false)
    sendMessage({
      content: messageInputRef.current.value,
      assistantID: selectedUserAssistant?.id,
      queryID: selectedQuery?.id
    })

    messageInputRef.current.value = ""
    messageInputRef.current.blur()
  }

  const clearInput = () => {
    if (!messageInputRef.current) return

    messageInputRef.current.value = ""
    setInputValid(false)
    setMessageCommand(false)
  }

  const handleMessageInputChange = () => {
    if (!messageInputRef.current) return
    if (messageInputRef.current.value.substring(0, 1) === "/") {
      setMessageCommand(true)
    } else {
      setMessageCommand(false)
    }

    setInputValid(messageInputRef.current.value.length > 0)
  }

  const handleMessageEnter = (event: React.KeyboardEvent) => {
    if (event.code === "Enter") {
      handleUserMessage()
    }
  }

  const handleAssistantSelect = (assistant: Assistant) => {
    setSelectedUserAssistant(assistant)
    updateUserSelectedAssistant(assistant.id)
  }

  return (
    <div className="relative">
      <div className="flex items-end gap-2 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Chrome size={14} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="top">
            <DropdownMenuLabel>Ассистенты</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="flex flex-col gap-1">
              {userAssistants.map(assistant => (
                <DropdownMenuItem className={`${assistant.id === selectedUserAssistant?.id && 'bg-muted'}`} onClick={() => handleAssistantSelect(assistant)}>
                  <span>{assistant.name}</span>
                </DropdownMenuItem>
              ))}
              {userAssistants.length === 0 && (
                <DropdownMenuItem onClick={() => navigate("/assistants")}>
                  Добавить ассистента
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/assistants")}>
                Открыть магазин
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex flex-col flex-1 gap-2 justify-center items-center relative">
          <Input
            disabled={!selectedUserAssistant}
            tabIndex={0}
            onChange={() => handleMessageInputChange()}
            onKeyDown={(event) => handleMessageEnter(event)}
            ref={messageInputRef}
            placeholder="Введите запрос"
          />
          {isMessageCommand && (
            <div className="right-1.5 absolute flex gap-1">
              <div
                className="text-sm cursor-default px-2 uppercase rounded py-1 bg-muted text-muted-foreground">
                Команда
              </div>
              <div
                className="px-2 cursor-pointer py-1 bg-muted flex items-center rounded text-muted-foreground"
                onClick={() => clearInput()}
              >
                <X size={15} />
              </div>
            </div>
          )}
        </div>
        <Button
          disabled={!isInputValid || !selectedUserAssistant}
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
