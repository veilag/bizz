import {useExpand, useInitData} from "@vkruglikov/react-telegram-web-app";
import {useEffect, useState} from "react";
import {checkAuthentication} from "./actions/auth.ts";
import LinkView from "./views/LinkView.tsx";
import MainView from "./views/MainView.tsx";
import {Loader} from "lucide-react";
import TimeAgo from 'javascript-time-ago'
import ru from 'javascript-time-ago/locale/ru'

TimeAgo.addDefaultLocale(ru)

const App = () => {
  const [isLinked, setLinked] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(true)
  const [, safeData] = useInitData()
  const [, expand] = useExpand()

  const handleAuth = async () => {
    const res = await checkAuthentication(safeData)

    setLoading(false)
    setLinked(!(res === undefined))
  }

  useEffect(() => {
    expand()
    handleAuth()
  }, []);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center h-screen">
      <Loader size={25} className="animate-spin"/>
    </div>
  )

  return (
    <div className="h-screen w-full">
      {!isLinked && <LinkView onSuccessLink={() => setLinked(true)}/>}
      {isLinked && <MainView/>}
    </div>
  )
}

export default App
