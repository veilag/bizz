import {ReactNode, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import NewAssistantForm from "@/components/forms/newAssistant/NewAssistantForm.tsx";
import {z} from "zod";
import assistantSchema from "@/components/forms/newAssistant/schema.ts";
import {addNewAssistant, updateAssistant} from "@/api/assistant.ts";
import {Assistant, assistantsAtom} from "@/atoms/assistant.ts";
import {useSetAtom} from "jotai";
import {toast} from "sonner";

interface NewAssistantDialogProps {
  children: ReactNode
  type: "new" | "update"
  assistant?: Assistant
}

const NewAssistantDialog = ({ children, assistant, type }: NewAssistantDialogProps) => {
  const [isOpen, setOpen] = useState<boolean>(false)
  const [isLoading, setLoading] = useState<boolean>(false)
  const setAssistantList = useSetAtom(assistantsAtom)

  const onSuccessAssistantCreation = (assistant: Assistant) => {
    setLoading(false)
    setOpen(false)

    setAssistantList(prev => [
      ...prev,
      assistant
    ])

    toast.success("Ассистент успешно создан")
  }

  const onErrorAssistantCreation = () => {
    setLoading(false)
    setOpen(false)

    toast.error("Во время создания ассистента произошла ошибка")
  }

  const onSubmit = (data: z.infer<typeof assistantSchema>) => {
    setLoading(true)

    if (type === "new") {
      addNewAssistant({
        name: data.name,
        description: data.description,
        code: data.code
      })
        .then(res => onSuccessAssistantCreation(res.data))
        .catch(() => onErrorAssistantCreation())

    } else {
      if (!assistant) return

      updateAssistant(assistant.id, {
        name: data.name,
        description: data.description,
        code: data.code
      })
        .then(() => {
          setAssistantList(prev => prev.map(assistantInList => {
            if (assistant.id === assistantInList.id) {
              return {
                ...assistantInList,

                name: data.name,
                description: data.description,
                code: data.code
              }
            }

            return assistantInList
          }))

          setLoading(false)
          setOpen(false)
          toast.success("Данные ассистента обновлены")
        })
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={open => setOpen(open)}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{type === "new" ? 'Создание нового ассистента' : 'Изменение ассистента'}</DialogTitle>
          {type === "new" && (
            <DialogDescription>
              Создайте собственного ассистента, который будет работать по вашим правилам
            </DialogDescription>
          )}
        </DialogHeader>

        <NewAssistantForm
          isLoading={isLoading}
          initialAssistant={assistant}
          onSubmit={onSubmit}
        />
      </DialogContent>
    </Dialog>
  )
}

export default NewAssistantDialog
