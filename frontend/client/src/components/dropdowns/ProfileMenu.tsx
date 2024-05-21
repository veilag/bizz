import {Dispatch, ReactNode, SetStateAction} from "react";
import {LogOut} from "react-feather";

import {Theme, useTheme} from "@/components/theme.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {useAtomValue} from "jotai";
import {userAtom} from "@/atoms/user.ts";

interface BusinessViewMenuProps {
  children: ReactNode

  setLinking: Dispatch<SetStateAction<boolean>>
  setSharing: Dispatch<SetStateAction<boolean>>
}

const ProfileMenu = ({ children, setLinking, setSharing }: BusinessViewMenuProps) => {
  const user = useAtomValue(userAtom)
  const {theme, setTheme} = useTheme()

  const logOut = () => {
    localStorage.removeItem("accessToken")
    localStorage.removeItem("refreshToken")

    window.location.reload()
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="w-full">
          {children}
        </DropdownMenuTrigger>

        <DropdownMenuContent side="right" className="w-56 ml-3 mt-2">
          <div className="py-2 flex flex-col">
            <span className="px-2 text-sm font-semibold">@ {user?.username}</span>
            <span className="px-2 text-muted-foreground text-sm">{user?.email}</span>
          </div>
          <DropdownMenuSeparator/>
          <DropdownMenuLabel>
            Оформление
          </DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuRadioGroup value={theme} onValueChange={(value) => setTheme(value as Theme)}>
            <DropdownMenuRadioItem value="light">Светлая</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="dark">Темная</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator/>
          <DropdownMenuLabel>
            Telegram
          </DropdownMenuLabel>
          <DropdownMenuSeparator/>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setLinking(true)}>
              <span>Привязать аккаунт</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          {user?.isDeveloper && (
            <>
              <DropdownMenuSeparator/>
              <DropdownMenuLabel>
                Разработчик
              </DropdownMenuLabel>
              <DropdownMenuSeparator/>
              <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setSharing(true)}>
                    <span>Поделится доступом</span>
                  </DropdownMenuItem>
              </DropdownMenuGroup>
            </>
          )}
          <DropdownMenuSeparator/>
          <DropdownMenuGroup>
            <DropdownMenuItem className="group text-red-500" onClick={() => logOut()}>
              <LogOut className="mr-2 w-4 h-4 group-hover:animate-icon-pong"/>
              <span>Выйти</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}

export default ProfileMenu
