import {Dispatch, forwardRef, SetStateAction, useEffect, useState} from "react";
import {ImperativePanelHandle} from "react-resizable-panels";

import BusinessListToolbar from "@/components/toolbars/BusinessListToolbar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Input} from "@/components/ui/input.tsx";
import {ResizablePanel} from "@/components/ui/resizable.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Tag} from "react-feather";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "@/store";
import BusinessCard from "@/components/BusinessCard.tsx";
import useWebSocket from "react-use-websocket";
import {ConnectionMessage} from "@/types/socket.ts";
import {WS_URL} from "@/config.ts";
import {addQueries, updatePlanStatus} from "@/store/slice/business.ts";
import {toast} from "sonner";
import axios from "axios";
import {BusinessGeneration} from "@/types/business.ts";
import {Skeleton} from "@/components/ui/skeleton.tsx";


interface BusinessListPanelProps {
  setCollapse: Dispatch<SetStateAction<boolean>>
}

const BusinessListPanel = forwardRef<ImperativePanelHandle, BusinessListPanelProps>(({ setCollapse }, ref) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const dispatch = useDispatch()
  const businessList = useSelector((state: RootState) => state.business.list)

  const {lastJsonMessage: message} = useWebSocket<ConnectionMessage>(
    WS_URL,
    {
      share: true,
      shouldReconnect: () => true
    }
  )

  const fetchBusinessQueries = () => {
    setLoading(true)
    const accessToken = localStorage.getItem("accessToken")

    axios.get<BusinessGeneration[]>("http://localhost:8000/business/list", {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    })
      .then((res) => {
        setLoading(false)
        const fixedDateList: BusinessGeneration[] = res.data.map(query => ({
          ...query,
          createdAt: new Date(query.createdAt).getTime()
        }))

        dispatch(addQueries(fixedDateList))

      })
      .catch(() => {
        setLoading(false)
        toast.error("Ошибка при загрузке планов")
      })
  }

  useEffect(() => {
    if (!message) return

    switch (message.event) {
      case "PLAN_GENERATION_UPDATE":
        toast.info("Бизнес план генерируется", {
          classNames: {
            toast: "w-fit"
          }
        })

        dispatch(updatePlanStatus({
          id: message.payload.id,
          is_generating: true
        }))
        break
    }
  }, [message]);

  useEffect(() => {
    fetchBusinessQueries()
  }, []);

  return (
    <ResizablePanel
      onCollapse={() => {
        setCollapse(true)
      }}
      onExpand={() => {
        setCollapse(false)
      }}
      ref={ref}
      collapsible
      minSize={30}
      defaultSize={30}
      maxSize={50}
    >
      <BusinessListToolbar />
      <Separator orientation="horizontal" />
      <div className="flex flex-col h-full">
        <div className="flex gap-2 p-4">
          <Input className="flex-1" placeholder="Найти"/>
          <Button variant="outline" size="icon">
            <Tag size={18}/>
          </Button>
        </div>

        <ScrollArea className="px-4 h-[calc(100%-128px)]">
          <ul className="flex flex-col-reverse gap-2 mb-4">
            {isLoading && [1, 2, 3].map(() => (
              <li>
                <Skeleton className="w-full h-[70px]"/>
              </li>
            ))}

            {businessList.map(query => (
              <li>
              <BusinessCard
                  id={query.id}
                  name={query.name}
                  query={query.query}
                  isGenerated={query.isGenerated}
                  isGenerating={query.isGenerating}
                  isQueued={query.isQueued}
                  createdAt={query.createdAt}
                />
              </li>
            ))}
          </ul>
        </ScrollArea>
      </div>
    </ResizablePanel>
  )
})

export default BusinessListPanel
