import {useEffect, useRef, useState} from "react";
import {ImperativePanelHandle} from "react-resizable-panels";

import {ResizableHandle, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import BusinessListPanel from "@/components/panels/BusinessListPanel.tsx";
import BusinessChatPanel from "@/components/panels/BusinessChatPanel.tsx";

const BusinessDashboardView = () => {
  const [isListPanelCollapsed, setListPaneCollapsed] = useState<boolean>(false)
  const listPanelRef = useRef<ImperativePanelHandle>(null)

  const handleCollapsing = () => {
    if (!listPanelRef.current) return;

    if (!isListPanelCollapsed) {
      listPanelRef.current.collapse()
      setListPaneCollapsed(true)

    } else {
      listPanelRef.current.expand()
      setListPaneCollapsed(false)
    }
  }

  useEffect(() => {
    if (!listPanelRef.current) return

    if (listPanelRef.current.isCollapsed()) {
      listPanelRef.current.expand()
    }
  }, [])

  return (
    <ResizablePanelGroup
      autoSaveId="business-dashboard"
      className="w-full h-full"
      direction="horizontal"
    >

      <BusinessListPanel
        ref={listPanelRef}
        setCollapse={setListPaneCollapsed}
      />
      <ResizableHandle withHandle/>
      <BusinessChatPanel
        isPanelCollapsed={isListPanelCollapsed}
        onPanelCollapse={() => handleCollapsing()}
      />

    </ResizablePanelGroup>
  )
}

export default BusinessDashboardView
