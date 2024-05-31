import {Loader} from "react-feather";
import {animated, useTransition} from "@react-spring/web";

interface ConnectionStatusProps {
  isConnectionLost: boolean
  isError: boolean
}

const ConnectionStatus = ({isConnectionLost, isError}: ConnectionStatusProps) => {
  const connectionLostTransition = useTransition(isConnectionLost, {
    from: {
      opacity: 0,
    },
    enter: {
      opacity: 1,
    },
    leave: {
      opacity: 0,
    }
  })

  return (
    <>
      {connectionLostTransition((style, active) => (
        active && (
          <animated.div
            style={style}
            className="absolute top-0 z-40 w-full">
            <div className="flex items-center justify-center gap-2 py-1 bg-red-400 text-white dark:bg-red-500 w-full">
              <span className="text-sm">Соединение разорвано. Попытка переподключения</span>
              <Loader size={14} className="animate-spin"/>
            </div>
          </animated.div>
        )
      ))}

      {connectionLostTransition((style, ) => (
        isError && (
          <animated.div
            style={style}
            className="absolute top-0 z-40 w-full">
          <div className="flex items-center dark:bg-white dark:text-black text-white justify-center
                        gap-2 py-1 bg-black w-full">
            <span className="text-sm">Сервер не отвечает</span>
          </div>
          </animated.div>
        )
      ))}
    </>
  )
}

export default ConnectionStatus
