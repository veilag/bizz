import {useSetAtom} from "jotai/index";
import {guideShowed} from "@/atoms/guide.ts";
import AnimateIn from "@/components/ui/animate.ts";
import {Button} from "@/components/ui/button.tsx";
import {Chrome} from "react-feather";

const AssistantsGuide = () => {
  const setShowed = useSetAtom(guideShowed)

  return (
    <div className="flex h-full justify-center items-center">
      <div className="absolute w-full h-full flex justify-center gap-2 z-0">
        <div className="w-screen h-screen origin-right opacity-50 bg-green-500 animate-rotate-out blur-[1000px]"></div>
        <div
          className="w-screen h-screen origin-left opacity-50 bg-purple-500 animate-rotate-in delay-1000 blur-[1000px]"></div>
      </div>
      <div className="absolute w-full h-full flex justify-center gap-2 z-0">
        <div className="w-screen h-screen origin-right opacity-50 bg-blue-500 animate-rotate-out blur-[1000px]"></div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <AnimateIn
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
          delay={50}
        >
          <Chrome size={80} className="text-white" />
        </AnimateIn>
        <AnimateIn
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
          delay={100}
        >
          <h1 className="text-4xl mt-2 text-white font-semibold leading-5">
            Магазин ассистентов
          </h1>
        </AnimateIn>
        <AnimateIn
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
          delay={150}
        >
          <p className="text-white mt-2 leading-5 w-96 text-center">
            Здесь вы можете найти ассистентов, которые упростят вашу работу с бизнес-планом
          </p>
        </AnimateIn>

        <AnimateIn
          className="w-full mt-5"
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
          delay={200}
        >
            <Button className="w-full" onClick={() => setShowed(false)}>
              Закрыть
            </Button>
        </AnimateIn>
      </div>
    </div>
  )
}

export default AssistantsGuide