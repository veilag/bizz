import {Button} from "@/components/ui/button.tsx";
import {Plus} from "react-feather";
import NewBusinessPlanDialog from "@/components/dialogs/NewBusinessPlanDialog.tsx";

const BusinessListToolbar = () => {
  return (
    <header className="h-14 text-lg flex justify-between items-center px-4">
      <h2 className="font-bold">Мои бизнес-планы</h2>
      <NewBusinessPlanDialog>
        <Button size="icon" variant="ghost">
          <Plus size={18} />
        </Button>
      </NewBusinessPlanDialog>
    </header>
  )
}

export default BusinessListToolbar
