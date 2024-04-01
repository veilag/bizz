import {TooltipWrapper} from "@/components/util/ui.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft, Maximize2, Minimize2, MoreVertical, RefreshCw, Trash} from "react-feather";
import BusinessViewMenu from "@/components/dropdowns/BusinessViewMenu.tsx";
import {useAtom, useSetAtom} from "jotai";
import {selectedQueryAtom} from "@/atoms/queries.ts";
import {messageListAtom} from "@/atoms/message.ts";
import {fetchMessage} from "@/api/message.ts";

interface BusinessViewToolbarProps {
  isPanelCollapsed: boolean
  onPanelCollapse: () => void
}

const BusinessChatToolbar = ({ isPanelCollapsed, onPanelCollapse }: BusinessViewToolbarProps) => {
  const [selectedQuery, setSelectedQuery] = useAtom(selectedQueryAtom)
  const setMessagesList = useSetAtom(messageListAtom)

  const handleChatClose = () => {
    setSelectedQuery(undefined)
    setMessagesList([])
  }

  const handleMessageListRefetch = () => {
    fetchMessage(selectedQuery?.messageGroupID)
  }

  return (
    <header className="h-14 flex justify-between items-center px-2">
      <div className="flex">
        <TooltipWrapper hint="Закрыть">
          <Button disabled={selectedQuery === undefined} onClick={() => handleChatClose()} size="icon" variant="ghost">
            <ArrowLeft size={18}/>
          </Button>
        </TooltipWrapper>
        <TooltipWrapper hint="Удалить план">
          <Button disabled={selectedQuery === undefined} size="icon" variant="ghost">
            <Trash size={18}/>
          </Button>
        </TooltipWrapper>
      </div>
      <div className="flex">
        <TooltipWrapper hint="Обновить диалог">
          <Button disabled={selectedQuery === undefined} size="icon" variant="ghost">
            <RefreshCw onClick={() => handleMessageListRefetch()} size={18}/>
          </Button>
        </TooltipWrapper>
        <TooltipWrapper hint="Размер окна">
          <Button disabled={selectedQuery === undefined} onClick={() => onPanelCollapse()} size="icon" variant="ghost">
            {!isPanelCollapsed ? <Maximize2 size={18}/> : <Minimize2 size={18}/>}
          </Button>
        </TooltipWrapper>
        <BusinessViewMenu>
          <Button disabled={selectedQuery === undefined} size="icon" variant="ghost">
            <MoreVertical size={18}/>
          </Button>
        </BusinessViewMenu>
      </div>
    </header>
  )
}

export default BusinessChatToolbar
