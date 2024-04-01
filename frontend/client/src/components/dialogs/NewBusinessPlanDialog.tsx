import {ReactNode, useState} from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog.tsx";
import {z} from "zod";
import {generateQuery} from "@/api/queries.ts";
import NewBusinessPlanForm from "@/components/forms/newBusinessQuery/NewBusinessPlanForm.tsx";
import schema from "@/components/forms/newBusinessQuery/schema.ts";

interface NewBusinessPlanDialogProps {
  children: ReactNode
}

const NewBusinessPlanDialog = ({ children }: NewBusinessPlanDialogProps) => {
  const [isLoading, setLoading] = useState<boolean>(false)
  const [isOpen, setOpen] = useState<boolean>(false)

  const onSuccessGenerationQuery = () => {
    setOpen(false)
    setLoading(false)
  }

  const onErrorGenerationQuery = () => {
    setOpen(false)
    setLoading(false)
  }

  const onSubmit = (data: z.infer<typeof schema>) => {
    setLoading(true)

    generateQuery({
      name: data.name,
      query: data.query,
      description: data.description,
      city: data.city
    })
      .then(() => onSuccessGenerationQuery())
      .catch(() => onErrorGenerationQuery())
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Генерация нового плана</DialogTitle>
          <DialogDescription>
            Генерация плана будет ожидать своей очереди,
            статус генерации можно посмотреть в списке планов
          </DialogDescription>
        </DialogHeader>

        <NewBusinessPlanForm
          isLoading={isLoading}
          onSubmit={onSubmit}
        />

      </DialogContent>
    </Dialog>
  )
}

export default NewBusinessPlanDialog
