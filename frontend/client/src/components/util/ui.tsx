import {ReactNode} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

type SideRefer = "top" | "right" | "bottom" | "left" | undefined

interface TooltipWrapperProps {
  side?: SideRefer
  hint: string
  children: ReactNode
}

const TooltipWrapper = ({ children, hint, side }: TooltipWrapperProps) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent side={side}>
        <p>{hint}</p>
      </TooltipContent>
    </Tooltip>
  )
}

export {
  TooltipWrapper
}
