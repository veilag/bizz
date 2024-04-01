import ProfileMenu from "@/components/dropdowns/ProfileMenu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {User} from "react-feather";
import {Separator} from "@/components/ui/separator.tsx";
import {ResizablePanel} from "@/components/ui/resizable.tsx";
import {useState} from "react";
import TelegramLinkingDialog from "@/components/dialogs/TelegramLinkingDialog.tsx";
import MainPanelNavigation from "@/components/MainPanelNavigation.tsx";
import {userAtom} from "@/atoms/user.ts";
import {useAtomValue} from "jotai";

const MainPanel = () => {
  const user = useAtomValue(userAtom)
  const [isLinking, setLinking] = useState<boolean>(false)

  const handleLinking = () => {
    setLinking(false)
  }

  return (
    <>
      <ResizablePanel minSize={15} maxSize={25} defaultSize={20}>
        <div className="flex flex-col w-full h-full">
          <header className="w-full h-14 flex justify-center items-center px-2">
            <ProfileMenu setLinking={setLinking}>
              <Button variant="outline" className="w-full justify-between">
                @ {user?.username}
                <User size={18}/>
              </Button>
            </ProfileMenu>
          </header>

          <Separator/>

          <MainPanelNavigation />
        </div>
      </ResizablePanel>

      <TelegramLinkingDialog open={isLinking} onClose={() => setLinking(false)} onLink={() => handleLinking()}/>
    </>
  )
}

export default MainPanel