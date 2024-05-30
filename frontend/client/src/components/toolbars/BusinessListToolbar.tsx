import {Button} from "@/components/ui/button.tsx";
import {Plus} from "react-feather";
import NewBusinessPlanDialog from "@/components/dialogs/NewBusinessPlanDialog.tsx";
import AnimateIn from "@/components/ui/animate.ts";

const BusinessListToolbar = () => {
  return (
    <header className="h-14 text-lg flex justify-between items-center px-4">
      <h2 className="font-semibold">Мои бизнес-планы</h2>
      <AnimateIn
        from="opacity-0 -translate-y-4"
        duration={300}
        to="opacity-100 translate-y-0 translate-x-0"
        delay={25}
      >
        <NewBusinessPlanDialog>
          <Button id="new-plan-button" size="icon" variant="ghost">
            <Plus size={18} />
          </Button>
        </NewBusinessPlanDialog>
      </AnimateIn>
    </header>
  )
}

export default BusinessListToolbar
