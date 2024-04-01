import {ResizableHandle, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import MainPanel from "@/components/panels/MainPanel.tsx";
import OutletPanel from "@/components/panels/OutletPanel.tsx";
import {useEffect} from "react";
import {fetchUserCredentials} from "@/api/user.ts";

const DashBoardView = () => {
  useEffect(() => {
    fetchUserCredentials()
  }, []);

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
