import {memo} from "react";
import {useAtomValue, useSetAtom} from "jotai";
import {selectedAssistantAtom, selectedUserAssistantAtom} from "@/atoms/assistant.ts";
import {useNavigate} from "react-router-dom";

const AssistantsToolbar = memo(() => {
  const selectedUserAssistant = useAtomValue(selectedUserAssistantAtom)
  const setSelectedAssistant = useSetAtom(selectedAssistantAtom)

  const navigate = useNavigate()

  return (
    <div className="p-2 flex items-end gap-2">
      <div className="flex w-full gap-2 flex-nowrap overflow-x-auto">
        {!selectedUserAssistant && (
          <div className="text-sm text-muted-foreground">
            Выберите ассистента
          </div>
        )}

        {selectedUserAssistant && (
          <div
            className="flex gap-2 cursor-pointer items-center text-sm text-muted-foreground"
            onClick={() => {
              setSelectedAssistant(selectedUserAssistant)
              navigate('/assistants')
            }}
          >
            {selectedUserAssistant.name}
          </div>
        )}
      </div>
    </div>
  )
})

export default AssistantsToolbar
