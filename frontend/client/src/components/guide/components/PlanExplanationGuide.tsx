import {useSetAtom} from "jotai/index";
import {guideShowed} from "@/atoms/guide.ts";
import AnimateIn from "@/components/ui/animate.ts";
import {Button} from "@/components/ui/button.tsx";

const PlanExplanationGuide = () => {
  const chatPanel = document.querySelector<HTMLDivElement>("#chat-panel")
  const style = {
    width: chatPanel?.offsetWidth
  }

  const setShowed = useSetAtom(guideShowed)

  return (
    <div className="flex h-full justify-center items-center">
      <div className="absolute w-full h-full flex justify-center gap-2 z-0 translate-x-[-50%]">
        <div className="w-screen h-screen origin-right opacity-50 bg-red-500 animate-rotate-out blur-[1000px]"></div>
        <div
          className="w-screen h-screen origin-left opacity-50 bg-purple-500 animate-rotate-in delay-1000 blur-[1000px]"></div>
      </div>
      <div style={style} className="h-screen absolute bg-white right-0 opacity-30 animate-pulse"></div>

      <div className="flex flex-col items-center gap-2 w-96 translate-x-[-100%]">
        <AnimateIn
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
        >
          <h1 className="text-2xl text-white font-semibold leading-5">
            План создан!
          </h1>
          <p className="mt-4 text-lg text-white font-medium leading-6">Осталось совсем немного, используйте ассистентов, которые помогут вам сгенерировать план</p>
        </AnimateIn>

        <AnimateIn
          className="w-full"
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
          delay={100}
        >
          <Button className="w-full mt-5" onClick={() => setShowed(false)}>
            Закрыть
          </Button>
        </AnimateIn>
      </div>
    </div>
  )
}

export default PlanExplanationGuide