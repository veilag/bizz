import {NavLink} from "react-router-dom";
import {Chrome, Grid, Info, ExternalLink} from "react-feather";
import {Separator} from "@/components/ui/separator.tsx";
import AnimateIn from "@/components/ui/animate.ts";

const MainPanelNavigation = () => {
  return (
    <nav>
      <ul className="p-2 flex flex-col gap-1">
        <li>
          <AnimateIn
            from="opacity-0 -translate-x-4"
            duration={300}
            to="opacity-100 translate-y-0 translate-x-0"
          >
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
          </AnimateIn>
        </li>

        <li>
          <AnimateIn
            from="opacity-0 -translate-x-4"
            to="opacity-100 translate-y-0 translate-x-0"
            duration={300}
            delay={50}
          >
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
          </AnimateIn>
        </li>

        <Separator/>

        <li>
          <AnimateIn
            from="opacity-0 -translate-x-4"
            to="opacity-100 translate-y-0 translate-x-0"
            duration={300}
            delay={100}
          >
          <a
            target="_blank"
            className="group hover:bg-accent justify-between hover:text-accent-foreground py-2 px-4 h-10 w-full inline-flex items-center  whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
            href="https://python-work.notion.site/BizzAI-6c663733ecc74b6a9fd7aa13f1509b02?pvs=4"
          >
            <div className="flex items-center">
              <Info className="w-4 h-4 mr-2 group-hover:animate-icon-pong"/>
              <span>Помощь</span>
            </div>
            <ExternalLink className="w-4 h-4 text-muted-foreground"/>
          </a>
          </AnimateIn>
        </li>
      </ul>
    </nav>
  )
}

export default MainPanelNavigation
