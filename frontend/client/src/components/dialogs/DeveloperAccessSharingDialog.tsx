import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import {useState} from "react";
import DeveloperAccessShareForm from "@/components/forms/developerAccessShare/DeveloperAccessShareForm.tsx";
import {z} from "zod";
import {accessDeveloperShareSchema} from "@/components/forms/developerAccessShare/schema.ts";
import {shareDeveloperPermission} from "@/api/user.ts";
import {toast} from "sonner";

interface DeveloperAccessSharingDialogProps {
  open: boolean
  onClose: (value: boolean) => void
}

const DeveloperAccessSharingDialog = ({ open, onClose }: DeveloperAccessSharingDialogProps) => {
  const [isLoading, setLoading] = useState<boolean>(false)

  const onSubmit = (data: z.infer<typeof accessDeveloperShareSchema>) => {
    setLoading(true)
    shareDeveloperPermission(data.username)
      .then(() => {
        onClose(false)
        toast.success("Доступ разработчика выдан")
      })
      .catch(() => {
        setLoading(false)
        toast.error("Пользователя с таким именем не существует")
      })
  }

  return (
    <Dialog open={open} onOpenChange={value => onClose(value)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Поделится доступом разработчика</DialogTitle>
          <DialogDescription>
            Поделитесь доступом разработчика с другим пользователем
          </DialogDescription>
        </DialogHeader>

        <DeveloperAccessShareForm onSubmit={data => onSubmit(data)} isLoading={isLoading} />
      </DialogContent>
    </Dialog>
  )
}

export default DeveloperAccessSharingDialog