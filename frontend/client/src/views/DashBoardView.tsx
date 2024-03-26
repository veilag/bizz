import {Separator} from "@/components/ui/separator.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal, DropdownMenuCheckboxItem
} from "@/components/ui/dropdown-menu.tsx";
import {TelegramLogo} from "@/assets/icons";
import {Globe, Grid, LogOut, Settings, Star, User, XOctagon} from "react-feather";
import {NavLink, Outlet, useNavigate} from "react-router-dom";
import {useState} from "react";
import TelegramLinkingAlert from "@/components/auth/TelegramLinkingAlert.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Theme, useTheme} from "@/components/theme.tsx";
import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";

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
    <ResizablePanelGroup autoSaveId="main" className="flex-1 w-full" direction="horizontal">
      <ResizablePanel minSize={15} maxSize={25} defaultSize={20}>
        <div className="flex flex-col w-full h-full">
          <header className="w-full h-14 flex justify-center items-center px-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild className="w-full">
                <Button variant="outline" className="w-full justify-between">
                  rgaliev
                  <User size={18}/>
                </Button>
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
                        <DropdownMenuLabel>
                          Безопасность
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuCheckboxItem>
                          Запретить вход через Telegram
                        </DropdownMenuCheckboxItem>
                        <DropdownMenuItem className="text-red-500">
                          <XOctagon className="mr-2 h-4 w-4" />
                          Завершить все активные сеансы
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                  <DropdownMenuSeparator/>
                  <DropdownMenuItem onClick={() => setLinking(true)}>
                    <TelegramLogo className="mr-2 w-4 h-4"/>
                    <span>Привязать Telegram</span>
                  </DropdownMenuItem>
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
          </header>

          <Separator orientation="horizontal"/>

          <ul className="p-2 flex flex-col gap-1">
            <li>
              <NavLink to="/list" className={({isActive, isPending}) =>
                isPending ? "group pending" : isActive ? "group active" : ""
              }>
                <Button variant="ghost" className="group-[.active]:bg-muted w-full justify-between font-normal">
                  <div className="flex items-center justify-center">
                    <Grid className="w-4 h-4 mr-2"/>
                    <span>Мои биззы</span>
                  </div>
                </Button>
              </NavLink>

            </li>
            <li>
              <Button variant="ghost" className="w-full justify-between font-normal">
                <div className="flex items-center justify-center">
                  <Star className="w-4 h-4 mr-2"/>
                  <span>Избранные</span>
                </div>
              </Button>
            </li>
          </ul>

          <Separator orientation="horizontal"/>

          <ul className="p-2">
            <li>
              <Button variant="ghost" className="w-full justify-between font-normal">
                <div className="flex items-center justify-center">
                  <Globe className="w-4 h-4 mr-2"/>
                  <span>Блог</span>
                </div>
              </Button>
            </li>
          </ul>

          <div className="flex flex-col flex-1 h-full justify-end p-2">
            <Button variant="ghost" className="justify-start font-normal">
              <span className="h-3 w-3 rounded-full bg-green-600 mr-2"></span>
              Соединение открыто
            </Button>
          </div>
        </div>

      </ResizablePanel>

      <ResizableHandle withHandle/>

      <ResizablePanel defaultSize={80}>
        <Outlet />
      </ResizablePanel>

      <TelegramLinkingAlert open={isLinking} onClose={() => setLinking(false)} onLink={() => handleLinking()}/>
    </ResizablePanelGroup>
  )
}

export default DashBoardView
