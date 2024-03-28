import {ResizableHandle, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import MainPanel from "@/components/panels/MainPanel.tsx";
import OutletPanel from "@/components/panels/OutletPanel.tsx";

const DashBoardView = () => {
  return (
    <ResizablePanelGroup
      autoSaveId="main"
      className="flex-1 w-full"
      direction="horizontal"
    >
      <MainPanel/>
      <ResizableHandle withHandle/>
      <OutletPanel/>
    </ResizablePanelGroup>
  )
}

export default DashBoardView
