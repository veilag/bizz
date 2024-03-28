import {Dispatch, ReactNode, SetStateAction, useState} from "react";
import {useNavigate} from "react-router-dom";
import {ArrowUpRight, LogOut, Settings, User} from "react-feather";

import {TelegramLogo} from "@/assets/icons";
import {Theme, useTheme} from "@/components/theme.tsx";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import SettingsDialog from "@/components/dialogs/SettingsDialog.tsx";

interface BusinessViewMenuProps {
  children: ReactNode
  setLinking: Dispatch<SetStateAction<boolean>>
}

const ProfileMenu = ({ children, setLinking }: BusinessViewMenuProps) => {
  const [isSettingsDialogOpen, setSettingsDialogOpen] = useState<boolean>(false)
  const {theme, setTheme} = useTheme()
  const navigate = useNavigate()

  const logOut = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")

    navigate("/login", {
      replace: true
    })
  }

  const handleSettingDialogOpen = (open: boolean) => {
    setSettingsDialogOpen(open)
  }

  return (
    <>
      <SettingsDialog isOpen={isSettingsDialogOpen} onOpenChange={(open) => handleSettingDialogOpen(open)} />
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-full">
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-56 ml-3 mt-2">
          <div className="py-2 flex flex-col">
            <span className="px-2 text-sm font-semibold">@ rgaliev</span>
            <span className="px-2 text-muted-foreground text-sm">rgaliev2004@gmail.com</span>
          </div>
          <DropdownMenuSeparator/>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <User className="mr-2 w-4 h-4"/>
              <span>Профиль</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Settings className="mr-2 w-4 h-4"/>
                <span>Настройки</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-72">
                  <DropdownMenuItem onClick={() => setSettingsDialogOpen(true)}>
                    <ArrowUpRight className="mr-2 h-4 w-4" />
                    Открыть
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>
                    Основное
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem checked>
                    Получать Telegram уведомления
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem checked>
                    Сохранять черновики запросов
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel className="flex items-center">
                    <TelegramLogo className="mr-2 w-4 h-4"/>
                    Telegram
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem>
                    Запретить вход через Telegram
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuItem onClick={() => setLinking(true)}>
                    <span>Привязать аккаунт</span>
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

          </DropdownMenuGroup>
          <DropdownMenuSeparator/>
          <DropdownMenuLabel>
            Оформление
          </DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
            <DropdownMenuRadioItem value="light">Светлая</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Темная</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="system">Как в системе</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator/>
          <DropdownMenuGroup>
            <DropdownMenuItem className="text-red-500" onClick={() => logOut()}>
              <LogOut className="mr-2 w-4 h-4"/>
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ProfileMenu
