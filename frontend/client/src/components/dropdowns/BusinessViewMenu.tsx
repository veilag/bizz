import {ReactNode} from "react";
import {X} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {selectedQueryAtom} from "@/atoms/queries.ts";
import {useAtomValue, useSetAtom} from "jotai";
import {clearQueryMessages} from "@/api/message.ts";
import {messageListAtom} from "@/atoms/message.ts";
import {selectedUserAssistantAtom} from "@/atoms/assistant.ts";

interface BusinessViewMenuProps {
  children: ReactNode
}

const BusinessViewMenu = ({ children }: BusinessViewMenuProps) => {
  const selectedQuery = useAtomValue(selectedQueryAtom)
  const selectedUserAssistant = useAtomValue(selectedUserAssistantAtom)
  const setMessageList = useSetAtom(messageListAtom)

  const handleMessageDelete = () => {
    if (!selectedQuery) return
    if (!selectedUserAssistant) return

    clearQueryMessages(selectedQuery.id, selectedUserAssistant.id)
      .then(() => setMessageList(prev => prev.filter(message => message.assistantID !== selectedUserAssistant.id)))
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuLabel>
          Разное
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => handleMessageDelete()}
          className="group text-red-500"
        >
          <X className="mr-2 h-4 w-4 group-hover:animate-icon-pong" />
          <span>Очистить чат ассистента</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BusinessViewMenu
