import {memo} from "react";
import {Button} from "@/components/ui/button.tsx";

const AssistantsToolbar = memo(() => (
  <div className="p-2 flex items-end gap-2">
    <div className="flex w-full gap-2">
      <Button variant="secondary">
        Bizzy
      </Button>
      <Button variant="outline">
        Bizzy - Финансовый помощник
      </Button>
    </div>
  </div>
))

export default AssistantsToolbar
