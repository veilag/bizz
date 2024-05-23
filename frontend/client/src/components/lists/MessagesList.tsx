import {TelegramLogo} from "@/assets/icons";
import ReactTimeAgo from "react-time-ago";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";
import {useAtomValue} from "jotai/index";
import {Message, messageListAtom} from "@/atoms/message.ts";
import {useEffect, useRef, useState} from "react";
import useWebSocket from "react-use-websocket";
import {WS_URL} from "@/config.ts";
import {useAtom} from "jotai";
import {userAtom} from "@/atoms/user.ts";
import {selectedUserAssistantAtom, userAssistantsAtom} from "@/atoms/assistant.ts";
import {toast} from "sonner";
import parse, {DOMNode, domToReact, Element} from 'html-react-parser';
import {X} from "lucide-react";
import {sendMessage, sendMessageCallback} from "@/api/message.ts";
import {ConnectionMessage} from "@/types/socket.ts";
import {AssistantMessageUpdatePayload, MessagePayload} from "@/types/payloads.ts";
import {useTheme} from "@/components/theme.tsx";
import {AlertTriangle, Chrome, Info, Loader, MessageCircle} from "react-feather";
import {Button} from "@/components/ui/button.tsx";
import {selectedQueryAtom} from "@/atoms/queries.ts";
import AnimateIn from "@/components/ui/animate.ts";

const toCamelCase = (str: string): string => {
  return str.replace(/-([a-z])/g, function (_, letter) {
    return letter.toUpperCase();
  });
}


const MessagesList = () => {
  const theme = useTheme()

  const {lastJsonMessage} = useWebSocket<ConnectionMessage>(
    WS_URL, {
      share: true
    }
  )

  const scrollTargetRef = useRef<HTMLDivElement>(null)
  const user = useAtomValue(userAtom)
  const [messages, setMessages] = useAtom(messageListAtom)

  const userAssistants = useAtomValue(userAssistantsAtom)
  const [selectedUserAssistant, setSelectedUserAssistant] = useAtom(selectedUserAssistantAtom)
  const selectedQuery = useAtomValue(selectedQueryAtom)
  const [assistantMessages, setAssistantMessages] = useState<Message[]>([])

  const scrollToLastMessage = () => {
    if (!scrollTargetRef.current) return

    scrollTargetRef.current.scrollIntoView({
      behavior: "smooth",
      block: "center"
    })
  }

  const filterAssistantMessages = () => {
    if (!selectedUserAssistant) return
    if (!user) return

    setAssistantMessages(messages.filter(message => {
      if (message.assistantID === selectedUserAssistant.id) {
        return message
      }
    }))
  }

  const sendCallback = (queryID: number, messageID: number, assistantID: number | undefined, fetchersData: string | undefined, callbackData: string | undefined) => {
    if (!assistantID) return
    sendMessageCallback(queryID, messageID, assistantID, fetchersData, callbackData)
  }

  const sendStartMessage = (assistantID: number | undefined = undefined) => {
    if (!selectedUserAssistant) return
    if (!selectedQuery) return

    sendMessage({
      content: "/start",
      queryID: selectedQuery.id,
      assistantID: assistantID ? assistantID : selectedUserAssistant.id
    })
  }

  const sendCommand = (command: string) => {
    if (!selectedUserAssistant) return
    if (!selectedQuery) return

    sendMessage({
      content: command,
      queryID: selectedQuery.id,
      assistantID: selectedUserAssistant.id
    })
  }

  useEffect(() => {
    if (!lastJsonMessage) return
    const message = lastJsonMessage.payload as MessagePayload

    switch (lastJsonMessage.event) {
      case "NEW_MESSAGE":
        setMessages(prev => [
          ...prev,
          message.data
        ])
        break

      case "USER_MESSAGE":
        setMessages(prev => [
          ...prev,
          message.data
        ])
        break

      case "ASSISTANT_MESSAGE_UPDATE":
        if ((lastJsonMessage.payload.data as {status: string}).status === "LOADING") {
          setMessages(prev => prev.map(messageInList => {
            if (messageInList.id === ((lastJsonMessage.payload) as AssistantMessageUpdatePayload).data.messageID) {
              return {
                ...messageInList,
                status: "LOADING"
              }
            }
            return messageInList
          }))
          return
        }

        setMessages(prev => prev.map(messageInList => {
          if (messageInList.id === ((lastJsonMessage.payload) as AssistantMessageUpdatePayload).data.messageID) {
            return {
              ...messageInList,

              content: ((lastJsonMessage.payload) as AssistantMessageUpdatePayload).data.contentUpdate,
              logs: ((lastJsonMessage.payload) as AssistantMessageUpdatePayload).data.logs,
              status: "RESPONSE"
            }
          }
          return messageInList
        }))
        break

      case "ASSISTANT_WIDGET_CLOSE":
        setMessages(prev => prev.map(messageInList => {
          if (messageInList.id === message.data.id) {
            return {
              ...messageInList,
              isWidgetClosed: true
            }
          }
          return messageInList
        }))
    }
  }, [lastJsonMessage]);

  useEffect(() => {
    filterAssistantMessages()
  }, [selectedUserAssistant, messages])

  useEffect(() => {
    scrollToLastMessage()
  }, [assistantMessages]);

  return (
    <ScrollArea className="h-[calc(100vh-11rem)] break-words chat-panel-scroll">
      <div className="flex flex-col pb-2 justify-end gap-1 break-words">
        {assistantMessages.map((message) => {
          return (
            <AnimateIn
              key={message.id}
              from="opacity-0 scale-90"
              to="opacity-100 scale-100"
              duration={300}
              className="break-words px-4 pt-4 group transition-all"
            >
              <div
                className="flex items-center gap-1 text-muted-foreground cursor-default dark:hover:text-white transition-all">
                {message.fromTelegram && (
                  <div className="mr-1">
                    <TelegramLogo className="w-4 h-4"/>
                  </div>
                )}
                {message.status === "LOADING" && (
                  <Loader size={15} className="animate-spin" />
                )}
                <div className="text-sm">{user?.id === message.userID ? 'Вы' : userAssistants.find(assistant => assistant.id === message?.assistantID)?.name} {message.fromTelegram && 'через мессенджер'}</div>
                <div className="text-xs">• <ReactTimeAgo date={new Date(message.createdAt)}/></div>
                <div
                  className="text-xs cursor-pointer group-hover:opacity-100 opacity-0 invisible group-hover:visible transition-all"
                  onClick={() => {
                    navigator.clipboard.writeText(message.content)
                    toast.success("Текст сообщения скопирован")
                  }}
                >
                  • Скопировать
                </div>
              </div>
              {message.userID && (
                <div className="text-sm mt-1 whitespace-pre-wrap break-words">
                  {message.content.substring(0, 1) === "/" && (
                    <div className="flex gap-1">
                      <span className="px-2 py-1 bg-muted text-muted-foreground rounded">команда</span>
                      <span
                        className="px-2 text-black dark:text-white py-1 rounded bg-muted cursor-pointer"
                        onClick={() => sendCommand(message.content)}
                      >
                        {message.content.slice(1)}
                      </span>
                    </div>
                  )}

                  {message.content.substring(0, 1) !== "/" && (
                    <div className="text-sm mt-1 whitespace-pre-wrap break-words">
                      {message.content}
                    </div>
                  )}
                </div>
              )}

              {!message.userID && message.assistantID && !message.isWidgetClosed && message.content !== "error" && parse(message.content, {
                replace(domNode) {
                  if (!(domNode as Element).attribs) return
                  if ((domNode as Element).attribs["data-style-dark"] && theme.theme === "dark") {
                    const inlineStyle = (domNode as Element).attribs['data-style-dark'];
                    delete (domNode as Element).attribs['data-style-dark'];
                    (domNode as Element).attribs.style = inlineStyle;
                    return domNode
                  }

                  if ((domNode as Element).name === "img") {
                    if ((domNode as Element).attribs["data-src-dark"] && theme.theme === "dark") {
                      const darkSrc = (domNode as Element).attribs["data-src-dark"];
                      delete (domNode as Element).attribs["data-src-dark"];
                      (domNode as Element).attribs.src = darkSrc;
                      return domNode
                    }
                  }

                  if ((domNode as Element).attribs.id === "caller") {
                    const fetcherInputs: string[] = []
                    let callbackData: string | undefined = undefined
                    const fetchersData: {
                      [key: string]: string;
                    } = {}

                    if ((domNode as Element).attribs["data-fetchers"]) {
                      fetcherInputs.push(...(domNode as Element).attribs["data-fetchers"].split(' '))
                    }

                    let styleObject: {
                      [key: string]: string;
                    } = {}

                    if ((domNode as Element).attribs["data-caller-style-dark"] || (domNode as Element).attribs.style) {
                      let inlineStyle: string = "";

                      if ((domNode as Element).attribs["data-caller-style-dark"]) {
                        if (theme.theme === "dark") {
                          inlineStyle = (domNode as Element).attribs["data-caller-style-dark"]
                        }
                      }

                      if ((domNode as Element).attribs.style) {
                        if (theme.theme === "light") {
                          inlineStyle = (domNode as Element).attribs.style
                        }
                      }

                      if ((domNode as Element).attribs.style) {
                        styleObject = inlineStyle
                          .split(";")
                          .map(style => style.trim())
                          .filter(Boolean)
                          .reduce<Record<string, string>>((acc, style) => {
                            const [key, value] = style.split(":");
                            acc[toCamelCase(key.trim())] = value.trim();
                            return acc;
                          }, {});
                      }
                    }

                    if ((domNode as Element).attribs["data-callback"]) {
                      callbackData = (domNode as Element).attribs["data-callback"]
                    }

                    const children = (domNode as Element).children
                    const childNodes = children as DOMNode[]

                    return <button style={styleObject} onClick={() => {
                      if ((domNode as Element).attribs["data-call-assistant"]) {
                        const assistantID = parseInt((domNode as Element).attribs["data-call-assistant"])
                        const userAssistant = userAssistants.find(assistant => assistant.id === assistantID)
                        if (!userAssistant) return

                        setSelectedUserAssistant(userAssistant)
                        sendStartMessage(userAssistant.id)
                      }

                      if (fetcherInputs.length !== 0) {
                        fetcherInputs.forEach(fetcherId => {
                          const fetcherInput: HTMLInputElement | null = document.querySelector(`#${fetcherId}`)
                          if (!fetcherInput) return
                          fetchersData[fetcherId] = fetcherInput.value
                        })
                      }

                      sendCallback(
                        message.queryID,
                        message.id,
                        message.assistantID,
                        JSON.stringify(fetchersData),
                        callbackData
                      )

                    }}>{domToReact(childNodes)}</button>
                  }
                }
              })}

              {message.content === "error" && !message.isWidgetClosed && (
                <div className="p-2 border rounded text-sm mt-1 text-muted-foreground flex items-center gap-1">
                  <AlertTriangle size={14} />
                  <span className="">Ошибка</span>
                </div>
              )}

              {message?.logs && !message.isWidgetClosed && (
                <div className="p-2 border rounded text-sm mt-1 text-muted-foreground flex items-center gap-1">
                  <div className="text-sm text-muted-foreground">
                    <Info size={14} />
                  </div>
                  <div className="font-mono text-sm">{JSON.stringify(message.logs)}</div>
                </div>
              )}

              {!message.userID && message.isWidgetClosed && (
                <div className="p-2 border rounded text-sm mt-1 text-muted-foreground flex items-center gap-1">
                  <X size={14} />
                  <span>Виджет закрыт</span>
                </div>
              )}
            </AnimateIn>
          )
        })}
        {assistantMessages.length === 0 && selectedUserAssistant && (
          <div className="mt-10 w-full flex-col flex items-center justify-center">
            <MessageCircle size={30} />
            <p className="font-medium mt-2">Чат с ассистентом пуст</p>
            <p className="text-sm text-muted-foreground">Напишите сообщение ассистенту</p>
            <Button onClick={() => sendStartMessage()} className="w-52 mt-5">
              /start
            </Button>
          </div>
        )}

        {!selectedUserAssistant && (
          <div className="mt-10 w-full flex-col flex items-center justify-center">
            <Chrome size={30} />
            <p className="font-medium mt-2">Выберите ассистента</p>
            <p className="text-sm text-muted-foreground">Для просмотра сообщений с ассистентом</p>
          </div>
        )}
        <div className="mt-1" ref={scrollTargetRef}></div>
      </div>
    </ScrollArea>
  )
}

export default MessagesList
