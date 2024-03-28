import {Outlet} from "react-router-dom";
import {ResizablePanel} from "@/components/ui/resizable.tsx";

const OutletPanel = () => {
  return (
    <ResizablePanel defaultSize={80}>
      <Outlet />
    </ResizablePanel>
  )
}

export default OutletPanel
