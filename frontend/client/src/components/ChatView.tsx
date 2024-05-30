import {ArrowLeft} from "react-feather";
import {Separator} from "@/components/ui/separator.tsx";
import {useAtomValue} from "jotai";
import {selectedQueryAtom} from "@/atoms/queries.ts";
import AssistantsToolbar from "@/components/toolbars/AssistantsToolbar.tsx";
import MessagesList from "@/components/lists/MessagesList.tsx";
import ChatForm from "@/components/forms/ChatForm.tsx";

const ChatView = () => {
  const selectedQuery = useAtomValue(selectedQueryAtom)

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
      <AssistantsToolbar/>
      <Separator/>
      <ChatForm/>
    </div>
  )
}

export default ChatView
