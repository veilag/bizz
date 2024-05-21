import {TooltipWrapper} from "@/components/util/ui.tsx";
import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft, Maximize2, Minimize2, MoreVertical, Trash} from "react-feather";
import BusinessViewMenu from "@/components/dropdowns/BusinessViewMenu.tsx";
import {useAtom, useSetAtom} from "jotai";
import {queriesListAtom, selectedQueryAtom} from "@/atoms/queries.ts";
import {messageListAtom} from "@/atoms/message.ts";
import {deleteQuery} from "@/api/queries.ts";

interface BusinessViewToolbarProps {
  isPanelCollapsed: boolean
  onPanelCollapse: () => void
  onClose: () => void
}

const BusinessChatToolbar = ({ isPanelCollapsed, onPanelCollapse, onClose }: BusinessViewToolbarProps) => {
  const [selectedQuery, setSelectedQuery] = useAtom(selectedQueryAtom)
  const setQueriesList = useSetAtom(queriesListAtom)
  const setMessagesList = useSetAtom(messageListAtom)

  const handleChatClose = () => {
    setSelectedQuery(undefined)
    setMessagesList([])

    onClose()
  }

  const handleQueryDelete = () => {
    if (!selectedQuery) return

    deleteQuery(selectedQuery.id)
      .then(() => {
        setSelectedQuery(undefined)
        setQueriesList(prev => prev.filter(query => query.id !== selectedQuery.id))
      })
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
          <Button
            onClick={() => handleQueryDelete()}
            disabled={selectedQuery === undefined}
            size="icon"
            variant="ghost"
          >
            <Trash size={18}/>
          </Button>
        </TooltipWrapper>
      </div>
      <div className="flex">
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
