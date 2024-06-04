import {Button} from "@/components/ui/button.tsx";
import {Menu, Plus} from "react-feather";
import NewBusinessPlanDialog from "@/components/dialogs/NewBusinessPlanDialog.tsx";
import AnimateIn from "@/components/ui/animate.ts";
import {X} from "lucide-react";
import {businessListShowedAtom, navigationShowedAtom} from "@/atoms/ui.ts";
import {useSetAtom} from "jotai";

const BusinessListToolbar = () => {
  const setListShowed = useSetAtom(businessListShowedAtom)
  const setNavigationShowed = useSetAtom(navigationShowedAtom)

  return (
    <header className="h-14 text-base lg:text-lg flex justify-between items-center px-4">
      <div className="flex gap-2 items-center">
        <Button className="md:hidden" onClick={() => setNavigationShowed(prev => !prev)} size="icon" variant="ghost">
          <Menu size={18} />
        </Button>
        <h2 className="font-semibold">Мои бизнес-планы</h2>
      </div>
      <div className="flex">
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
        <Button className="md:hidden" onClick={() => setListShowed(false)} size="icon" variant="ghost">
          <X size={18} />
        </Button>
      </div>
    </header>
  )
}

export default BusinessListToolbar
