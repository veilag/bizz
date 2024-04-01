import {ReactNode} from "react";
import {Plus} from "react-feather";
import {X} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent, DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";

interface BusinessViewMenuProps {
  children: ReactNode
}

const BusinessViewMenu = ({ children }: BusinessViewMenuProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="mr-2">
        <DropdownMenuLabel>
          Пользователи
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group">
          <Plus className="mr-2 h-4 w-4 group-hover:animate-icon-pong" />
          <span>Пригласить</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuLabel>
          Разное
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="group text-red-500">
        <X className="mr-2 h-4 w-4 group-hover:animate-icon-pong" />
          <span>Очистить диалог</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default BusinessViewMenu
