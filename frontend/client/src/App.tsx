import {RouterProvider} from "react-router-dom";
import router from "./router";

import {ThemeProvider} from "@/components/theme.tsx";
import {TooltipProvider} from "@/components/ui/tooltip.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";
import ConnectionStatus from "@/components/ConnectionStatus.tsx";
import {CustomView, MobileOnlyView, useDeviceSelectors} from "react-device-detect";
import useConnection from "@/hooks/connection.ts";

import TimeAgo from 'javascript-time-ago'
import ru from 'javascript-time-ago/locale/ru'
import {Provider} from "jotai";
import atomStore from "@/atoms";
import GuideProvider from "@/components/guide/GuideProvider.tsx";
import {Logo} from "@/assets/icons";

TimeAgo.addDefaultLocale(ru)

const App = () => {
  const [selectors, ] = useDeviceSelectors(window.navigator.userAgent)
  const {isTablet, isDesktop} = selectors

  const {isConnectionLost, isError} = useConnection()

  return (
    <Provider store={atomStore}>
      <ThemeProvider defaultTheme="system" storageKey="theme">
        <CustomView
          condition={isTablet || isDesktop}
        >
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
          <GuideProvider />
        </CustomView>

        <MobileOnlyView>
          <div className="w-screen h-screen flex flex-col justify-center items-center p-4 overflow-hidden">
            <div className="absolute w-full h-full flex flex-wrap justify-center gap-2 z-0">
              <div
                className="w-96 h-96 origin-right opacity-80 bg-green-500 animate-rotate-out blur-[500px]"></div>
              <div
                className="w-96 h-96 origin-left opacity-80 bg-purple-500 animate-rotate-in delay-1000 blur-[500px]"></div>
            </div>
            <div className="absolute w-full h-full flex justify-center gap-2 z-0">
              <div
                className="w-96 h-96 origin-right opacity-80 bg-blue-500 animate-rotate-out blur-[500px]"></div>
            </div>

            <div className="flex flex-col items-center z-[100]">
              <Logo className="w-20 h-20"/>
              <h2 className="text-center text-xl font-semibold mt-5">Откройте на компьютере</h2>
              <p
                className="text-center leading-5"
              >
                К сожалению приложение не доступно на мобильных устройствах, мы над этим уже работаем!
              </p>
            </div>
          </div>
        </MobileOnlyView>
      </ThemeProvider>
    </Provider>
  )
}

export default App
