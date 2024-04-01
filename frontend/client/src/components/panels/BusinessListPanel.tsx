import {Dispatch, forwardRef, SetStateAction, useCallback, useEffect} from "react";
import {ImperativePanelHandle} from "react-resizable-panels";

import BusinessListToolbar from "@/components/toolbars/BusinessListToolbar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Input} from "@/components/ui/input.tsx";
import {ResizablePanel} from "@/components/ui/resizable.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Tag} from "react-feather";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import BusinessCard from "@/components/items/BusinessCard.tsx";
import useWebSocket from "react-use-websocket";
import {ConnectionMessage} from "@/types/socket.ts";
import {WS_URL} from "@/config.ts";
import {toast} from "sonner";
import {useAtom} from "jotai";
import {queriesListAtom, selectedQueryAtom} from "@/atoms/queries.ts";
import {QueryCreatedPayload, QueryStatusUpdatePayload} from "@/types/payloads.ts";
import {fetchQueries} from "@/api/queries.ts";
import {BusinessQuery} from "@/types/business.ts";

interface BusinessListPanelProps {
  setCollapse: Dispatch<SetStateAction<boolean>>
}

const BusinessListPanel = forwardRef<ImperativePanelHandle, BusinessListPanelProps>(({ setCollapse }, ref) => {
  const [selectedQuery, setSelectedQuery] = useAtom(selectedQueryAtom)
  const [queriesList, setQueriesList] = useAtom(queriesListAtom)

  const {lastJsonMessage: message} = useWebSocket<ConnectionMessage>(
    WS_URL,
    {
      share: true,
      shouldReconnect: () => true
    }
  )

  useEffect(() => {
    if (!message) return

    switch (message.event) {
      case "QUERY_CREATED":
        setQueriesList(prev => [
          ...prev,
          (message.payload as QueryCreatedPayload).data
        ])

        toast.success("Бизнес план отправлен на генерацию")
        break

      case "PLAN_GENERATION_UPDATE":
        if ((message.payload as QueryStatusUpdatePayload).data.status == "GENERATION") {
          toast.info("Бизнес план генерируется", {
            classNames: {
              toast: "w-fit"
            }
          })
        } else if ((message.payload as QueryStatusUpdatePayload).data.status == "GENERATED") {
          toast.info("Бизнес план сгенерирован", {
            classNames: {
              toast: "w-fit"
            }
          })
        }

        setQueriesList(prev => prev.map(query => {
          if (query.id === (message.payload as QueryStatusUpdatePayload).data.id) {
            return {
              ...query,
              status: (message.payload as QueryStatusUpdatePayload).data.status
            }
          }

          return {
            ...query
          }
        }))
        break
    }
  }, [message]);

  const handleQuerySelection = useCallback((query: BusinessQuery) => {
    setSelectedQuery(query)
  }, [])

  useEffect(() => {
    console.log(queriesList)
  }, [queriesList]);

  useEffect(() => {
    fetchQueries()
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
            {queriesList.map(query => (
              <li className={`group ${selectedQuery?.id === query.id ? 'active' : ''}`} key={query.id}>
                <BusinessCard
                  key={query.id}
                  query={query}
                  onClick={handleQuerySelection}
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
