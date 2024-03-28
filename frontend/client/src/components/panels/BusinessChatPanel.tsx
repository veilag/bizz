import BusinessChatToolbar from "@/components/toolbars/BusinessChatToolbar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {ResizablePanel} from "@/components/ui/resizable.tsx";
import ChatView from "@/components/ChatView.tsx";

interface BusinessChatPanel {
  isPanelCollapsed: boolean
  onPanelCollapse: () => void
}

const BusinessChatPanel = ({isPanelCollapsed, onPanelCollapse}: BusinessChatPanel) => {
  return (
    <ResizablePanel
      className="flex flex-col"
      defaultSize={70}
    >
      <BusinessChatToolbar
        isPanelCollapsed={isPanelCollapsed}
        onPanelCollapse={() => onPanelCollapse()}
      />
      <Separator />
      <ChatView />
    </ResizablePanel>
  )
}

export default BusinessChatPanel
