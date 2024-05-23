import {Logo} from "@/assets/icons";
import {Button} from "@/components/ui/button.tsx";
import {useSetAtom} from "jotai";
import {guideStateAtom} from "@/atoms/guide.ts";
import AnimateIn from "@/components/ui/animate.ts";
import {ArrowRight} from "react-feather";

const StartGuide = () => {
  const setState = useSetAtom(guideStateAtom)

  return (
    <div className="flex h-full justify-center items-center">
      <div className="absolute w-full h-full flex justify-center gap-2 z-0">
        <div className="w-screen h-screen origin-right opacity-50 bg-red-500 animate-rotate-out blur-[1000px]"></div>
        <div
          className="w-screen h-screen origin-left opacity-50 bg-purple-500 animate-rotate-in delay-1000 blur-[1000px]"></div>
      </div>
      <div className="absolute w-full h-full flex justify-center gap-2 z-0">
        <div className="w-screen h-screen origin-right opacity-50 bg-blue-500 animate-rotate-out blur-[1000px]"></div>
      </div>
      <div className="absolute w-full h-full flex justify-center gap-2 z-0">
        <div className="w-screen h-screen origin-top-left opacity-50 bg-orange-500 animate-rotate-out delay-1000 blur-[1000px]"></div>
      </div>

      <div className="flex flex-col items-center">
        <AnimateIn
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
        >
          <Logo light={true} className="h-20 w-20"/>
        </AnimateIn>

        <AnimateIn
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
          delay={50}
        >
          <h1 className="text-4xl mt-4 text-white font-semibold leading-5">
            Добро пожаловать
          </h1>
        </AnimateIn>
        <AnimateIn
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
          delay={100}
        >
          <p className="text-white mt-4 leading-5 w-96 text-center">Пройдите обучение перед тем как пользоваться приложением</p>
        </AnimateIn>

        <div className="flex gap-1 flex-col w-96 mt-5">
          <AnimateIn
            className="w-full"
            from="opacity-0 -translate-y-4"
            to="opacity-100 translate-y-0 translate-x-0"
            delay={150}
          >
              <Button className="w-full" onClick={() => {
                setState("newPlan")
              }}>
                <span>Продолжить</span>
                <ArrowRight className="ml-2" size={16}/>
              </Button>
          </AnimateIn>
        </div>
      </div>
    </div>
  )
}

export default StartGuide