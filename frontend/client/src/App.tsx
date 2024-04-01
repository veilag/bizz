import {RouterProvider} from "react-router-dom";
import router from "./router";

import {ThemeProvider} from "@/components/theme.tsx";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";
import ConnectionStatus from "@/components/ConnectionStatus.tsx";
import useConnection from "@/hooks/connection.ts";

import TimeAgo from 'javascript-time-ago'
import ru from 'javascript-time-ago/locale/ru'
import {Provider} from "jotai";
import atomStore from "@/atoms";

TimeAgo.addDefaultLocale(ru)

const App = () => {
  const {isConnectionLost, isError} = useConnection()

  return (
    <Provider store={atomStore}>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <TooltipProvider>
          <ConnectionStatus isConnectionLost={isConnectionLost} isError={isError} />
          <Toaster
            position="bottom-left"
            toastOptions={{
              classNames: {
                toast: "border border-muted text-black dark:text-white bg-white dark:bg-black"
              }
            }}
          />
          <RouterProvider router={router}/>
        </TooltipProvider>
      </ThemeProvider>
    </Provider>
  )
}

export default App
