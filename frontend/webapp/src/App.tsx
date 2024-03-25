import {useExpand, useInitData} from "@vkruglikov/react-telegram-web-app";
import {useEffect, useState} from "react";
import {checkAuthentication} from "./actions/auth.ts";
import LinkView from "./views/LinkView.tsx";
import MainView from "./views/MainView.tsx";

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
    handleAuth()
    expand()
  }, []);

  if (isLoading) return (
    <div className="flex flex-col items-center justify-center p-2 h-screen">
      <h1>Loading...</h1>
    </div>
  )

  return (
    <div className="flex flex-col items-center justify-center p-2 h-screen">
      {!isLinked && <LinkView onSuccessLink={() => setLinked(true)}/>}
      {isLinked && <MainView/>}
    </div>
  )
}

export default App
