import {Button} from "@/components/ui/button.tsx";
import {ArrowLeft, Maximize2, Menu, Minimize2, MoreVertical, Trash} from "react-feather";
import BusinessViewMenu from "@/components/dropdowns/BusinessViewMenu.tsx";
import {useAtom, useSetAtom} from "jotai";
import {queriesListAtom, selectedQueryAtom} from "@/atoms/queries.ts";
import {messageListAtom} from "@/atoms/message.ts";
import {deleteQuery} from "@/api/queries.ts";
import AnimateIn from "@/components/ui/animate.ts";
import {updateUserSelectedQuery} from "@/api/user.ts";
import {businessListShowedAtom} from "@/atoms/ui.ts";

interface BusinessViewToolbarProps {
  isPanelCollapsed: boolean
  onPanelCollapse: () => void
  onClose: () => void
}

const BusinessChatToolbar = ({ isPanelCollapsed, onPanelCollapse, onClose }: BusinessViewToolbarProps) => {
  const [selectedQuery, setSelectedQuery] = useAtom(selectedQueryAtom)
  const setQueriesList = useSetAtom(queriesListAtom)
  const setMessagesList = useSetAtom(messageListAtom)
  const setListShowed = useSetAtom(businessListShowedAtom)

  const handleChatClose = () => {
    updateUserSelectedQuery(null)
    setSelectedQuery(undefined)
    setMessagesList([])

    onClose()
  }

  const handleQueryDelete = () => {
    if (!selectedQuery) return

    updateUserSelectedQuery(null)
    deleteQuery(selectedQuery.id)
      .then(() => {
        setSelectedQuery(undefined)
        setQueriesList(prev => prev.filter(query => query.id !== selectedQuery.id))
      })
  }

  const showList = () => {
    setListShowed(prev => !prev)
  }

  return (
    <header className="h-14 flex justify-between items-center px-2">
      <div className="flex">
        <Button onClick={showList} className="md:hidden" disabled={selectedQuery === undefined} size="icon" variant="ghost">
          <Menu size={18} />
        </Button>
          <AnimateIn
              from="opacity-0 -translate-y-4"
              to="opacity-100 translate-y-0 translate-x-0"
              duration={300}
              delay={50}
            >
            <Button className="hidden md:flex" disabled={selectedQuery === undefined} onClick={() => handleChatClose()} size="icon" variant="ghost">
              <ArrowLeft size={18}/>
            </Button>
          </AnimateIn>
        <AnimateIn
          from="opacity-0 -translate-y-4"
          duration={300}
          to="opacity-100 translate-y-0 translate-x-0"
          delay={100}
        >
            <Button
              onClick={() => handleQueryDelete()}
              disabled={selectedQuery === undefined}
              size="icon"
              variant="ghost"
            >
              <Trash size={18}/>
            </Button>
        </AnimateIn>
      </div>
      <div className="flex">
        <AnimateIn
          from="opacity-0 -translate-y-4"
          duration={300}
          to="opacity-100 translate-y-0 translate-x-0"
          delay={150}
        >
            <Button disabled={selectedQuery === undefined} onClick={() => onPanelCollapse()} size="icon" variant="ghost">
              {!isPanelCollapsed ? <Maximize2 size={18}/> : <Minimize2 size={18}/>}
            </Button>
        </AnimateIn>
        <AnimateIn
          from="opacity-0 -translate-y-4"
          duration={300}
          to="opacity-100 translate-y-0 translate-x-0"
          delay={200}
        >
          <BusinessViewMenu>
            <Button disabled={selectedQuery === undefined} size="icon" variant="ghost">
              <MoreVertical size={18}/>
            </Button>
          </BusinessViewMenu>
        </AnimateIn>
      </div>
    </header>
  )
}

export default BusinessChatToolbar
