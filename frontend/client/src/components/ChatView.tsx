import {ArrowLeft} from "react-feather";
import {Separator} from "@/components/ui/separator.tsx";
import {useEffect} from "react";
import {useAtomValue} from "jotai";
import {selectedQueryAtom} from "@/atoms/queries.ts";
import {fetchMessage} from "@/api/message.ts";
import AssistantsToolbar from "@/components/toolbars/AssistantsToolbar.tsx";
import MessagesList from "@/components/lists/MessagesList.tsx";
import ChatForm from "@/components/ChatForm.tsx";

const ChatView = () => {
  const selectedQuery = useAtomValue(selectedQueryAtom)

  useEffect(() => {
    if (!selectedQuery) return
    fetchMessage(selectedQuery.messageGroupID)
  }, [selectedQuery]);

  if (!selectedQuery) {
    return (
      <div className="flex justify-center items-center flex-1">
        <ArrowLeft className="w-5 h-5 mr-2" />
        Выберите бизнес план
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1">
      <MessagesList/>
      <Separator/>
      {/*<div className="flex text-xs py-1 px-2 items-center cursor-default">*/}
      {/*  <span className="mr-2">@rgaliev печатает</span>*/}
      {/*  <div className="flex gap-0.5 mt-[2px]">*/}
      {/*    <span className="w-1 h-1 delay-0 bg-muted-foreground rounded-full animate-bounce"></span>*/}
      {/*    <span className="w-1 h-1 delay-200 bg-muted-foreground rounded-full animate-bounce"></span>*/}
      {/*    <span className="w-1 h-1 delay-400 bg-muted-foreground rounded-full animate-bounce"></span>*/}
      {/*  </div>*/}
      {/*</div>*/}
      {/*<Separator/>*/}
      <AssistantsToolbar/>
      <Separator/>
      <ChatForm/>
    </div>
  )
}

export default ChatView
