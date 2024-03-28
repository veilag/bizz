import ProfileMenu from "@/components/dropdowns/ProfileMenu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Chrome, Grid, Info, Key, Tag, User} from "react-feather";
import {Separator} from "@/components/ui/separator.tsx";
import {NavLink} from "react-router-dom";
import {ResizablePanel} from "@/components/ui/resizable.tsx";
import {useState} from "react";
import TelegramLinkingDialog from "@/components/dialogs/TelegramLinkingDialog.tsx";

const MainPanel = () => {
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
                rgaliev
                <User size={18}/>
              </Button>
            </ProfileMenu>
          </header>

          <Separator/>

          <ul className="p-2 flex flex-col gap-1">
            <li>
              <NavLink to="/list" className={({isActive, isPending}) =>
                isPending ? "group pending" : isActive ? "group active" : ""
              }>
                <Button variant="ghost" className="group-[.active]:bg-muted w-full justify-between font-normal">
                  <div className="flex items-center justify-center">
                    <Grid className="w-4 h-4 mr-2"/>
                    <span>Мои бизнес-планы</span>
                  </div>
                </Button>
              </NavLink>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-between font-normal">
                <div className="flex items-center justify-center">
                  <Tag className="w-4 h-4 mr-2"/>
                  <span>Теги</span>
                </div>
              </Button>
            </li>
          </ul>

          <Separator/>

          <ul className="p-2 flex flex-col gap-1">
            <li>
              <Button variant="ghost" className="w-full justify-between font-normal">
                <div className="flex items-center justify-center">
                  <Chrome className="w-4 h-4 mr-2"/>
                  <span>Ассистенты</span>
                </div>
              </Button>
            </li>
            <li>
              <Button variant="ghost" className="w-full justify-between font-normal">
                <div className="flex items-center justify-center">
                  <Key className="w-4 h-4 mr-2"/>
                  <span>Ключи</span>
                </div>
              </Button>
            </li>
          </ul>

          <Separator/>

          <ul className="p-2 flex flex-col gap-1">
            <li>
              <Button variant="ghost" className="w-full justify-between font-normal">
                <div className="flex items-center justify-center">
                  <Info className="w-4 h-4 mr-2"/>
                  <span>Помощь</span>
                </div>
              </Button>
            </li>
          </ul>
        </div>
      </ResizablePanel>

      <TelegramLinkingDialog open={isLinking} onClose={() => setLinking(false)} onLink={() => handleLinking()}/>
    </>
  )
}

export default MainPanel