import {Dialog, DialogContent} from "@/components/ui/dialog.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Settings} from "react-feather";

interface SettingsDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

const SettingsDialog = ({ isOpen, onOpenChange }: SettingsDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => onOpenChange(open)}>
      <DialogContent className="max-w-[calc(100%-5rem)] flex gap-0 p-0 h-[calc(100%-5rem)]">
        <div className="flex flex-col w-72 h-full">
          <header className="p-4 flex font-medium items-center">
            <Settings className="w-5 h-5 mr-2" />
            Настройки приложения
          </header>
          <Separator />
        </div>
        <Separator orientation="vertical" />
        <div className="flex-1 h-full">
          <header className="h-14"></header>
          <Separator />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SettingsDialog
