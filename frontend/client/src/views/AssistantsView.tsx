import {ResizableHandle, ResizablePanel, ResizablePanelGroup} from "@/components/ui/resizable.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import {AlignLeft, ArrowRight, Chrome, Edit3, Loader, Plus, Search} from "react-feather";
import {ChangeEvent, useEffect, useState} from "react";
import {addAssistantToUser, fetchAssistants, removeAssistantFromUser} from "@/api/assistant.ts";
import {useAtom, useAtomValue} from "jotai";
import {
  Assistant,
  assistantsAtom,
  selectedAssistantAtom,
  selectedUserAssistantAtom,
  userAssistantsAtom
} from "@/atoms/assistant.ts";
import {Input} from "@/components/ui/input.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import Markdown from "react-markdown";
import {Check, X} from "lucide-react";
import {userAtom} from "@/atoms/user.ts";
import {useNavigate} from "react-router-dom";
import atomStore from "@/atoms";
import {toast} from "sonner";
import AnimateIn from "@/components/ui/animate.ts";
import {useSetAtom} from "jotai/index";
import {guideStateAtom} from "@/atoms/guide.ts";

const AssistantsView = () => {
  const setState = useSetAtom(guideStateAtom)

  const [isLoading, setLoading] = useState<boolean>(false)
  const user = useAtomValue(userAtom)
  const assistants = useAtomValue(assistantsAtom)
  const [userAssistants, setUserAssistants] = useAtom(userAssistantsAtom)
  const [selectedAssistant, setSelectedAssistant] = useAtom(selectedAssistantAtom)
  const [selectedUserAssistant, setSelectedUserAssistant] = useAtom(selectedUserAssistantAtom)

  const [searchQuery, setSearchQuery] = useState<string>("")
  const [filteredAssistantList, setFilteredAssistantList] = useState<Assistant[]>([])

  const navigate = useNavigate()

  const filterAssistantList = () => {
    if (searchQuery === "") {
      setFilteredAssistantList(assistants)
      return
    }

    setFilteredAssistantList(assistants.filter(assistant => {
      if (assistant.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return assistant
      }
    }))
  }

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value)
  }

  const handleUserAssistantAdding = (assistant: Assistant) => {
    addAssistantToUser(assistant.id)
      .then(() => {
        setUserAssistants(prev => [
          ...prev,
          assistant
        ])

        setSelectedUserAssistant(assistant)
      })
  }

  const handleUserAssistantDelete = (assistant: Assistant) => {
    if (assistant.id === 1 || assistant.id === 2) {
      toast.warning("Вы не можете убрать системного ассистента")
      return
    }
    removeAssistantFromUser(assistant.id)
      .then(() => {
        setUserAssistants(prev => prev.filter(assistantInList => assistantInList.id != assistant.id))
        if (assistant.id === selectedUserAssistant?.id) {
          setSelectedUserAssistant(undefined)
        }
      })
  }

  useEffect(() => {
    filterAssistantList()
  }, [searchQuery, assistants]);

  useEffect(() => {
    if (assistants.length === 0) {
      setLoading(true)
    }

    fetchAssistants()
      .then(res => {
        atomStore.set(assistantsAtom, res.data)
        setLoading(false)
      })

    setState("assistants")
  }, [])

  return (
    <ResizablePanelGroup
      autoSaveId="assistants-dashboard"
      direction="horizontal"
      className="w-full h-full"
    >
      <ResizablePanel
        className="sm:hidden md:block max-[639px]:hidden"
        defaultSize={30}
      >
        <header className="h-14 text-lg flex justify-between items-center px-4">
          <h2 className="font-semibold">Ассистенты</h2>
          <AnimateIn
            from="opacity-0 -translate-y-4"
            duration={300}
            to="opacity-100 translate-y-0 translate-x-0"
            delay={25}
          >
            <Button
              disabled={!user?.isDeveloper}
              size="icon"
              variant="ghost"
              onClick={() => navigate('/editor', {
              state: {
                edit: false
              }
            })}>
              <Plus size={18}/>
            </Button>
          </AnimateIn>
        </header>
        <Separator/>
        <div className="flex flex-col h-full">
          <div className="flex gap-2 p-4">
            <Input
              value={searchQuery}
              onChange={handleSearchInput}
              className="flex-1"
              placeholder="Найти"/>

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
            {!isLoading && filteredAssistantList.length !== 0 && (
              <ul className="flex flex-col-reverse gap-2 mb-4">
                {filteredAssistantList.map((assistant, index) => (
                  <AnimateIn
                    from="opacity-0 scale-90 -translate-y-4"
                    to="opacity-100 scale-100 translate-y-0 translate-x-0"
                    delay={50 * index}
                    key={assistant.id}
                    duration={300}
                    as="li"
                    className={`group ${assistant.id === selectedAssistant?.id ? 'active' : ''}`}
                  >
                    <button
                      onClick={() => setSelectedAssistant(assistant)}
                      className={`group-[.active]:bg-accent w-full relative flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all hover:bg-accent`}>
                      <div className="flex w-full flex-col gap-1">
                        <div className="flex items-center">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold">
                              {assistant.name}
                            </div>
                          </div>
                        </div>
                      </div>

                      {userAssistants.some(userAssistant => userAssistant.id === assistant.id) && (
                        <div className="flex gap-1">
                          <Badge variant="outline">Добавлено</Badge>
                        </div>
                      )}
                    </button>
                  </AnimateIn>

            ))}
          </ul>
          )}

          {isLoading && (
            <div className="w-full flex justify-center pt-5">
              <Loader size={20} className="animate-spin"/>
            </div>
          )}

          {!isLoading && filteredAssistantList.length === 0 && searchQuery !== "" && (
            <div className="w-full flex items-center flex-col pt-5 text-center">
              <Search size={30}/>
              <h2 className="text-lg font-semibold mt-2">Ничего не найдено</h2>
              <p className="text-muted-foreground text-sm">Ассистента по запросу не существует</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </ResizablePanel>

  <ResizableHandle withHandle/>

  <ResizablePanel defaultSize={70}>
    <div className="h-full">
      <header className="h-14 px-4 flex items-center justify-between">
        {selectedAssistant && (
          <>
            <AnimateIn
              from="opacity-0 -translate-y-4"
              duration={300}
              to="opacity-100 translate-y-0 translate-x-0"
              delay={50}
            >
              <div className="flex gap-2 items-center">
                <Chrome size={18}/>
                <ArrowRight size={18}/>
                <span className="text-lg font-medium">
                  {selectedAssistant?.name}
                </span>
              </div>
            </AnimateIn>

            <div className="flex items-center gap-2">
              {user?.id === selectedAssistant.createdBy && (
                <AnimateIn
                  from="opacity-0 -translate-y-4"
                  duration={300}
                  to="opacity-100 translate-y-0 translate-x-0"
                  delay={100}
                >
                  <Button onClick={() => navigate('/editor', {
                    state: {
                        edit: true
                      }
                    })} variant="ghost">
                      <Edit3 className="mr-2" size={18} />
                      Редактировать
                    </Button>
                </AnimateIn>
              )}

              {userAssistants.some(assistant => assistant.id == selectedAssistant.id) && (
                <AnimateIn
                  from="opacity-0 -translate-y-4"
                  duration={300}
                  to="opacity-100 translate-y-0 translate-x-0"
                  delay={150}
                >
                  <Button onClick={() => handleUserAssistantDelete(selectedAssistant)} variant="outline">
                    <Check className="mr-2" size={18} /> Добавлено
                  </Button>
                </AnimateIn>
              )}

              {!userAssistants.some(assistant => assistant.id == selectedAssistant.id) && (
                <AnimateIn
                  from="opacity-0 -translate-y-4"
                  duration={300}
                  to="opacity-100 translate-y-0 translate-x-0"
                  delay={200}
                >
                  <Button onClick={() => handleUserAssistantAdding(selectedAssistant)}>
                    <Plus className="mr-2" size={18}/>
                    <span>Добавить</span>
                  </Button>
                </AnimateIn>
              )}
            </div>
          </>
        )}

        {!selectedAssistant && (
          <AnimateIn
            from="opacity-0 -translate-y-4"
            duration={300}
            to="opacity-100 translate-y-0 translate-x-0"
            delay={50}
          >
            <h2 className="font-medium">Выберите ассистента</h2>
          </AnimateIn>
        )}

          </header>
          <Separator/>
          <div className="px-4 py-2 items-center flex gap-2">
            <AlignLeft size={15}/>
            <h2 className="font-medium text-sm">Описание</h2>
          </div>
          <Separator/>
          <ScrollArea className="h-[calc(100vh-6rem)]">
            <Markdown
              className="p-4 whitespace-pre-wrap h-[calc(100%-10rem)] [&>h1]:font-semibold [&>code]:font-mono"
              components={{
                code(props) {
                  return (
                    <code className="text-xs p-1 bg-muted rounded">{props.children}</code>
                  )
                }
              }}
            >
              {selectedAssistant?.description}
            </Markdown>
          </ScrollArea>
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export default AssistantsView
