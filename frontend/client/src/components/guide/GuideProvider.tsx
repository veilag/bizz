import StartGuide from "@/components/guide/components/StartGuide.tsx";
import {useAtom} from "jotai";
import {guideShowed, guideStateAtom} from "@/atoms/guide.ts";
import NewPlanGuide from "@/components/guide/components/NewPlanGuide.tsx";
import PlanExplanationGuide from "@/components/guide/components/PlanExplanationGuide.tsx";
import AssistantsGuide from "@/components/guide/components/AssistantsGuide.tsx";
import {ReactNode, useEffect} from "react";

const components: {[key: string]: ReactNode} = {
  "start": <StartGuide />,
  "newPlan": <NewPlanGuide />,
  "planExplanation": <PlanExplanationGuide />,
  "assistants": <AssistantsGuide />
}

const GuideProvider = () => {
  const [isShowed, setShowed] = useAtom(guideShowed)
  const [guideState, setGuideState] = useAtom(guideStateAtom)

  useEffect(() => {
    if (guideState === "") {
      return
    }

    if (localStorage.getItem(guideState + "Passed") === null) {
      localStorage.setItem(guideState + "Passed", "false")
    }
    if (localStorage.getItem(guideState + "Passed") === "false") {
      setShowed(true)
      localStorage.setItem(guideState + "Passed", "true")
    } else {
      setGuideState("")
      setShowed(false)
    }
  }, [guideState])

  if (isShowed) return (
    <div className="absolute h-full w-full overflow-hidden">
      <div className="absolute h-full w-full bg-neutral-700 opacity-85 z-[100]"></div>
      <div className="h-full z-[200] relative">
        {components[guideState]}
      </div>
    </div>
  )
}

export default GuideProvider