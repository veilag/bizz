import {ResizableHandle, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import MainPanel from "@/components/panels/MainPanel.tsx";
import OutletPanel from "@/components/panels/OutletPanel.tsx";
import {useEffect} from "react";
import {fetchUserCredentials} from "@/api/user.ts";
import {fetchUserAssistants, getAssistantByID} from "@/api/assistant.ts";
import {useSetAtom} from "jotai";
import {userAtom} from "@/atoms/user.ts";
import {selectedQueryAtom} from "@/atoms/queries.ts";
import {getQueryByID} from "@/api/queries.ts";
import {selectedUserAssistantAtom} from "@/atoms/assistant.ts";

const DashBoardView = () => {
  const setUser = useSetAtom(userAtom)

  const setSelectedQueryID = useSetAtom(selectedQueryAtom)
  const setSelectedUserAssistant = useSetAtom(selectedUserAssistantAtom)

  useEffect(() => {
    fetchUserCredentials()
      .then(res => {
        setUser(res.data)

        if (res.data.selectedQueryID) {
          getQueryByID(res.data.selectedQueryID)
            .then(res => setSelectedQueryID(res.data))
        }

        if (res.data.selectedAssistantID) {
          getAssistantByID(res.data.selectedAssistantID)
            .then(res => setSelectedUserAssistant(res.data))
        }
      })

    fetchUserAssistants()
  }, []);

  return (
    <ResizablePanelGroup
      autoSaveId="main"
      className="flex-1 w-full"
      direction="horizontal"
    >
      <MainPanel/>
      <ResizableHandle className="z-[30] md:flex hidden" withHandle/>
      <OutletPanel/>
    </ResizablePanelGroup>
  )
}

export default DashBoardView
