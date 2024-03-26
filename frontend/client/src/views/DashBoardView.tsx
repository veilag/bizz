import {Separator} from "@/components/ui/separator.tsx";
import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
  DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuSeparator,
  DropdownMenuTrigger, DropdownMenuRadioItem
} from "@/components/ui/dropdown-menu.tsx";
import {TelegramLogo} from "@/assets/icons";
import {LogOut, Settings, User} from "react-feather";
import {useNavigate} from "react-router-dom";
import {useState} from "react";
import TelegramLinkingAlert from "@/components/auth/TelegramLinkingAlert.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Theme, useTheme} from "@/components/theme.tsx";

const DashBoardView = () => {
  const [isLinking, setLinking] = useState<boolean>(false)

  const {setTheme, theme} = useTheme()
  const navigate = useNavigate()

  const handleLinking = () => {
    setLinking(false)
  }

  const logOut = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")

    navigate("/login", {
      replace: true
    })
  }

  return (
    <div className="flex flex-col h-screen">
      <TelegramLinkingAlert open={isLinking} onClose={() => setLinking(false)} onLink={() => handleLinking()}/>

      <header className="h-12 flex justify-between items-center px-4">
        <div className="flex justify-center items-center gap-x-0.5">
          <img width={23} src="/logo-left.svg" alt="Logotype"/>
          <img className="mt-1.5" width={25} src="/logo-right.svg" alt=""/>
        </div>
        <div className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost">rgaliev</Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent side="bottom" className="w-56 mr-2 mt-2">
              <div className="py-2 flex flex-col">
                <span className="px-2 text-sm font-semibold">@ rgaliev</span>
                <span className="px-2 text-muted-foreground text-sm">rgaliev2004@gmail.com</span>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 w-4 h-4" />
                  <span>Профиль</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 w-4 h-4" />
                  <span>Настройки</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setLinking(true)}>
                  <TelegramLogo className="mr-2 w-4 h-4" />
                  <span>Привязать Telegram</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>
                Оформление
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
                <DropdownMenuRadioItem value="light">Светлая</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="dark">Темная</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="system">Как в системе</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem className="text-red-500" onClick={() => logOut()}>
                  <LogOut className="mr-2 w-4 h-4" />
                  <span>Выйти</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <Separator orientation="horizontal"/>
    </div>
  )
}

export default DashBoardView
