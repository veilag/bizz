import {NavLink} from "react-router-dom";
import {Chrome, Grid, Info, Key, Tag} from "react-feather";
import {Separator} from "@/components/ui/separator.tsx";

const MainPanelNavigation = () => {
  return (
    <nav>
      <ul className="p-2 flex flex-col gap-1">
        <li>
          <NavLink to="/list" className={({isActive, isPending}) =>
            isPending ? "group pending" : isActive ?
              "bg-accent text-accent-foreground py-2 px-4 h-10 w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" :
              "group hover:bg-accent hover:text-accent-foreground py-2 px-4 h-10 w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          }>
            <div className="flex items-center justify-center">
              <Grid className="w-4 h-4 mr-2 group-hover:animate-icon-pong"/>
              <span>Мои бизнес-планы</span>
            </div>
          </NavLink>
        </li>
        <li>
          <NavLink to="/tags" className={({isActive, isPending}) =>
            isPending ? "group pending" : isActive ?
              "bg-accent text-accent-foreground py-2 px-4 h-10 w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" :
              "group hover:bg-accent hover:text-accent-foreground py-2 px-4 h-10 w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          }>
            <div className="flex items-center justify-center">
              <Tag className="w-4 h-4 mr-2 group-hover:animate-icon-pong"/>
              <span>Теги</span>
            </div>
          </NavLink>
        </li>

        <Separator/>

        <li>
          <NavLink to="/assistants" className={({isActive, isPending}) =>
            isPending ? "group pending" : isActive ?
              "bg-accent text-accent-foreground py-2 px-4 h-10 w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" :
              "group hover:bg-accent hover:text-accent-foreground py-2 px-4 h-10 w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          }>
            <div className="flex items-center justify-center">
              <Chrome className="w-4 h-4 mr-2 group-hover:animate-icon-pong"/>
              <span>Ассистенты</span>
            </div>
          </NavLink>
        </li>

        <li>
          <NavLink to="/keys" className={({isActive, isPending}) =>
            isPending ? "group pending" : isActive ?
              "bg-accent text-accent-foreground py-2 px-4 h-10 w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" :
              "group hover:bg-accent hover:text-accent-foreground py-2 px-4 h-10 w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          }>
            <div className="flex items-center justify-center">
              <Key className="w-4 h-4 mr-2 group-hover:animate-icon-pong"/>
              <span>Ключи</span>
            </div>
          </NavLink>
        </li>

        <Separator/>

        <li>
          <NavLink to="/help" className={({isActive, isPending}) =>
            isPending ? "" : isActive ?
              "bg-accent text-accent-foreground py-2 px-4 h-10 w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50" :
              "group hover:bg-accent hover:text-accent-foreground py-2 px-4 h-10 w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          }>
            <div className="flex items-center justify-center">
              <Info className="w-4 h-4 mr-2 group-hover:animate-icon-pong"/>
              <span>Помощь</span>
            </div>
          </NavLink>
        </li>
      </ul>
    </nav>
  )
}

export default MainPanelNavigation
