import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {
  ArrowLeft,
  Crosshair,
  Maximize2,
  MessageCircle,
  Minimize2,
  MoreVertical,
  RefreshCw,
  Send,
  Trash
} from "react-feather";
import {useEffect, useRef, useState} from "react";

interface CollapsiblePanel {
  collapse: () => void
  expand: () => void
  isCollapsed: () => boolean
}

const BusinessDashboardView = () => {
  const [isListPanelCollapsed, setListPaneCollapsed] = useState<boolean>(false)
  const navigate = useNavigate()
  const listRef = useRef(null)

  const handleCollapsing = () => {
    const collapsablePanelRef = listRef.current as unknown as CollapsiblePanel

    if (!isListPanelCollapsed) {
      collapsablePanelRef.collapse()
      setListPaneCollapsed(true)

      return
    }

    collapsablePanelRef.expand()
    setListPaneCollapsed(false)
  }

  const handleQueryDrafting = () => {

  }

  useEffect(() => {
    if (listRef.current === null) return
    const collapsablePanelRef = listRef.current as unknown as CollapsiblePanel

    if (collapsablePanelRef.isCollapsed()) {
      collapsablePanelRef.expand()
    }

  }, [listRef])

  return (
    <ResizablePanelGroup autoSaveId="business-dashboard" className="w-full h-full" direction="horizontal">
      <ResizablePanel
        onCollapse={() => {
          setListPaneCollapsed(true)
        }}
        onExpand={() => {
          setListPaneCollapsed(false)
        }}
        ref={listRef}
        collapsible
        minSize={30}
        defaultSize={40}
        maxSize={50}>
        <header className="h-14 font-bold text-lg flex items-center pl-4">
          Мои биззы
        </header>
        <Separator orientation="horizontal" />
        <div className="p-3">
          <div>
            <Input placeholder="Найти" />
          </div>

          <ul className="mt-3 flex flex-col gap-2">
            <li>
              <div
                onClick={() => navigate("/list/one")}
                className="transition-all cursor-pointer hover:bg-muted flex justify-center items-center rounded border h-20">
                First bizz
              </div>
            </li>
            <li>
              <div
                className="transition-all cursor-pointer hover:bg-muted flex justify-center items-center rounded border h-20">
                Second bizz
              </div>
            </li>
            <li>
              <div
                className="transition-all cursor-pointer hover:bg-muted flex justify-center items-center rounded border h-20">
                Third bizz
              </div>
            </li>
          </ul>
        </div>
      </ResizablePanel>
      <ResizableHandle withHandle/>
      <ResizablePanel className="flex flex-col" defaultSize={60}>
        <header className="h-14 flex justify-between items-center px-2">
          <div className="flex">
            <Button size="icon" variant="ghost">
              <ArrowLeft size={18} />
            </Button>
            <Button size="icon" variant="ghost">
              <Trash size={18} />
            </Button>
          </div>
          <div className="flex">
            <Button size="icon" variant="ghost">
              <RefreshCw size={18} />
            </Button>
            <Button onClick={() => handleCollapsing()} size="icon" variant="ghost">
              {!isListPanelCollapsed ? <Maximize2 size={18} /> : <Minimize2 size={18} />}
            </Button>
            <Button size="icon" variant="ghost">
              <MoreVertical size={18} />
            </Button>
          </div>
        </header>
        <Separator orientation="horizontal" />
        <div className="flex flex-col flex-1">
          <div className="flex-1 relative flex justify-center items-center text-muted-foreground p-4">
            <div className="absolute gap-2 flex right-2 top-2">
              <Button variant="secondary" size="icon"><MessageCircle size={18}/></Button>
              <Button variant="outline" size="icon"><Crosshair size={18}/></Button>
            </div>
            Сообщения...
          </div>
          <Separator orientation="horizontal" />
          <div className="p-4 flex items-end gap-2">
            <div className="flex flex-col flex-1">
              <span className="text-xs mb-2 text-muted-foreground">Сохраняем в черновик</span>
              <Input onChange={() => handleQueryDrafting()} placeholder="Введите запрос" />
            </div>
            <Button  variant="secondary" size="icon"><Send size={18}/></Button>
          </div>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default BusinessDashboardView
