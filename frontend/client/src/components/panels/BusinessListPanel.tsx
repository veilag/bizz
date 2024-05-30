import {ChangeEvent, Dispatch, forwardRef, SetStateAction, useCallback, useEffect, useState} from "react";
import {ImperativePanelHandle} from "react-resizable-panels";

import BusinessListToolbar from "@/components/toolbars/BusinessListToolbar.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Input} from "@/components/ui/input.tsx";
import {ResizablePanel} from "@/components/ui/resizable.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import BusinessCard from "@/components/items/BusinessCard.tsx";
import useWebSocket from "react-use-websocket";
import {ConnectionMessage} from "@/types/socket.ts";
import {WS_URL} from "@/config.ts";
import {toast} from "sonner";
import {useAtom, useAtomValue, useSetAtom} from "jotai";
import {queriesListAtom, selectedQueryAtom} from "@/atoms/queries.ts";
import {QueryCreatedPayload} from "@/types/payloads.ts";
import {fetchQueries} from "@/api/queries.ts";
import {BusinessQuery} from "@/types/business.ts";
import {updateUserSelectedQuery} from "@/api/user.ts";
import atomStore from "@/atoms";
import {Info, Loader, Search} from "react-feather";
import {Button} from "@/components/ui/button.tsx";
import {X} from "lucide-react";
import {selectedUserAssistantAtom, userAssistantsAtom} from "@/atoms/assistant.ts";
import {sendMessage} from "@/api/message.ts";
import AnimateIn from "@/components/ui/animate.ts";

interface BusinessListPanelProps {
  setCollapse: Dispatch<SetStateAction<boolean>>
}

const BusinessListPanel = forwardRef<ImperativePanelHandle, BusinessListPanelProps>(({ setCollapse }, ref) => {
  const [searchQuery, setSearchQuery] = useState<string>("")

  const [isLoading, setLoading] = useState<boolean>(false)
  const [selectedQuery, setSelectedQuery] = useAtom(selectedQueryAtom)
  const setSelectedAssistant = useSetAtom(selectedUserAssistantAtom)
  const userAssistants = useAtomValue(userAssistantsAtom)
  const [queriesList, setQueriesList] = useAtom(queriesListAtom)
  const [filteredQueriesList, setFilteredQueriesList] = useState<BusinessQuery[]>([])

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
      case "BUSINESS_CREATED":
        setQueriesList(prev => [
          ...prev,
          (message.payload as QueryCreatedPayload).data
        ])

        toast.success("Бизнес план создан")
        setSelectedQuery((message.payload as QueryCreatedPayload).data)
        updateUserSelectedQuery((message.payload as QueryCreatedPayload).data.id)

        setSelectedAssistant(userAssistants.find(assistant => assistant.id === 1))
        sendMessage({
          content: "/start",
          assistantID: 1,
          queryID: (message.payload as QueryCreatedPayload).data.id
        })
        break
    }
  }, [message]);

  const handleQuerySelection = useCallback((query: BusinessQuery) => {
    setSelectedQuery(query)
    updateUserSelectedQuery(query.id)
  }, [])

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const filterQueriesList = () => {
    if (searchQuery === "") {
      setFilteredQueriesList(queriesList)
      return
    }

    setFilteredQueriesList(queriesList.filter(query => {
      if (query.name.includes(searchQuery) || query.description.includes(searchQuery)) {
        return query
      }
    }))
  }

  useEffect(() => {
    filterQueriesList()
  }, [searchQuery, queriesList]);

  useEffect(() => {
    if (queriesList.length === 0) {
      setLoading(true)
    }

    fetchQueries()
      .then(res => {
        atomStore.set(queriesListAtom, res.data)
        setLoading(false)
      })
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
          <Input
            disabled={queriesList.length === 0}
            value={searchQuery}
            onChange={(value) => handleSearchInput(value)}
            className="flex-1"
            placeholder="Найти"
          />
          {searchQuery !== "" && (
            <AnimateIn
              from="opacity-0 translate-x-4"
              to="opacity-100 translate-y-0 translate-x-0"
              duration={200}
            >
              <Button
                onClick={() => setSearchQuery("")}
                size="icon"
                variant="outline"
              >
                <X size={14} />
              </Button>
            </AnimateIn>
          )}
        </div>

        <ScrollArea className="px-4 h-[calc(100%-128px)]">
          {!isLoading && filteredQueriesList.length !== 0 && (
            <ul className="flex flex-col-reverse gap-2 mb-4">
              {filteredQueriesList.map((query, index) => (
                <li className={`group ${selectedQuery?.id === query.id ? 'active' : ''}`} key={query.id}>
                  <BusinessCard
                    index={index}
                    key={query.id}
                    query={query}
                    onClick={handleQuerySelection}
                  />
                </li>
              ))}
            </ul>
          )}

          {isLoading && (
            <div className="w-full flex justify-center pt-5">
              <Loader size={20} className="animate-spin"/>
            </div>
          )}

          {!isLoading && queriesList.length === 0 && (
            <div className="w-full flex items-center flex-col pt-5 text-center">
              <Info size={30} />
              <h2 className="text-lg font-semibold mt-2">Список планов пуст</h2>
              <p className="text-muted-foreground text-sm">Создайте новый план кликнув по кнопке выше</p>
            </div>
          )}

          {!isLoading && filteredQueriesList.length === 0 && searchQuery !== "" && (
            <div className="w-full flex items-center flex-col pt-5 text-center">
              <Search size={30}/>
              <h2 className="text-lg font-semibold mt-2">Ничего не найдено</h2>
              <p className="text-muted-foreground text-sm">Возможно, вы удалили план, который искали</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </ResizablePanel>
  )
})

export default BusinessListPanel
