import ProfileMenu from "@/components/dropdowns/ProfileMenu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {User} from "react-feather";
import {Separator} from "@/components/ui/separator.tsx";
import {ResizablePanel} from "@/components/ui/resizable.tsx";
import {useState} from "react";
import TelegramLinkingDialog from "@/components/dialogs/TelegramLinkingDialog.tsx";
import MainPanelNavigation from "@/components/MainPanelNavigation.tsx";
import {userAtom} from "@/atoms/user.ts";
import {useAtom, useAtomValue} from "jotai";
import DeveloperAccessSharingDialog from "@/components/dialogs/DeveloperAccessSharingDialog.tsx";
import {navigationShowedAtom} from "@/atoms/ui.ts";
import {X} from "lucide-react";

const MainPanel = () => {
  const [showed, setShowed] = useAtom(navigationShowedAtom)
  const user = useAtomValue(userAtom)

  const [isLinking, setLinking] = useState<boolean>(false)
  const [isSharing, setSharing] = useState<boolean>(false)

  return (
    <>
      <ResizablePanel
        className={`${showed ? 'translate-x-0' : '-translate-x-full'} bg-white dark:bg-black z-[20] transition-transform h-svh w-screen absolute md:static md:block`}
        minSize={15}
        maxSize={25}
        defaultSize={20}
      >
        <div className="flex flex-col w-full h-full">
          <header className="w-full h-14 flex justify-center gap-2 items-center px-2">
            <ProfileMenu setSharing={setSharing} setLinking={setLinking}>
              <Button variant="outline" className="w-full flex-1 justify-between">
                @ {user?.username}
                <User size={18}/>
              </Button>
            </ProfileMenu>
            <Button className="md:hidden" onClick={() => setShowed(false)} variant="outline" size="icon">
              <X size={18}/>
            </Button>
          </header>

          <Separator/>

          <MainPanelNavigation />
        </div>
      </ResizablePanel>

      <TelegramLinkingDialog open={isLinking} onClose={() => setLinking(false)} onLink={() => setLinking(false)}/>
      <DeveloperAccessSharingDialog open={isSharing} onClose={() => setSharing(false)} />
    </>
  )
}

export default MainPanel