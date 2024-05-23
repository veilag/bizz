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
import {useSetAtom} from "jotai/index";
import {guideStateAtom} from "@/atoms/guide.ts";

interface NewBusinessPlanDialogProps {
  children: ReactNode
}

const NewBusinessPlanDialog = ({ children }: NewBusinessPlanDialogProps) => {
  const setState = useSetAtom(guideStateAtom)

  const [isLoading, setLoading] = useState<boolean>(false)
  const [isOpen, setOpen] = useState<boolean>(false)

  const onSuccessGenerationQuery = () => {
    setOpen(false)
    setLoading(false)
    setState("planExplanation")
  }

  const onErrorGenerationQuery = () => {
    setOpen(false)
    setLoading(false)
  }

  const onSubmit = (data: z.infer<typeof schema>) => {
    setLoading(true)

    generateQuery({
      name: data.name,
      description: data.description,
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
          <DialogTitle>Создание нового плана</DialogTitle>
          <DialogDescription>
            После создания плана, вы сможете сгенерировать информацию о бизнесе
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
