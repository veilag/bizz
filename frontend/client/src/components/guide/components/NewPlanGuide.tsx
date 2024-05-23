import {useSetAtom} from "jotai/index";
import {guideShowed} from "@/atoms/guide.ts";
import AnimateIn from "@/components/ui/animate.ts";
import {Button} from "@/components/ui/button.tsx";
import {Plus} from "react-feather";

const NewPlanGuide = () => {
  const button = document.querySelector<HTMLButtonElement>("#new-plan-button")
  const style: {[key: string]: string} = {
    position: "absolute",
    top: button?.getBoundingClientRect().top + 'px',
    left: button?.getBoundingClientRect().left + 'px'
  }

  const setShowed = useSetAtom(guideShowed)

  return (
    <div className="flex h-full justify-center items-center">
      <div className="absolute w-full h-full flex justify-center gap-2 z-0">
        <div className="w-screen h-screen origin-right opacity-50 bg-blue-500 animate-rotate-out blur-[1000px]"></div>
        <div
          className="w-screen h-screen origin-left opacity-50 bg-orange-500 animate-rotate-in delay-1000 blur-[1000px]"></div>
      </div>
      <div className="absolute w-full h-full flex justify-center gap-2 z-0">
        <div className="w-screen h-screen origin-right opacity-50 bg-red-500 animate-rotate-out blur-[1000px]"></div>
      </div>

      <div style={style}
           className="w-40 h-40 bg-white opacity-0 animate-pulse translate-x-[-37%] rounded-full translate-y-[-45%]"></div>
      <div style={style}
           className="w-[40px] h-[40px] border-white border-2 rounded flex justify-center items-center text-white">
        <Plus size={20}/>
      </div>

      <div className="flex flex-col items-center gap-2">
        <AnimateIn
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
        >
          <h1 className="text-4xl mt-4 text-white font-semibold leading-5">
            Создайте план
          </h1>
        </AnimateIn>
        <AnimateIn
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
        >
          <p className="text-white mt-4 leading-5 w-96 text-center">
            Начнем с малого и создадим план, сделайте это нажав на указанную кнопку
          </p>
        </AnimateIn>

        <AnimateIn
          className="w-full mt-3"
          from="opacity-0 -translate-y-4"
          to="opacity-100 translate-y-0 translate-x-0"
          delay={100}
        >
          <Button className="w-full" onClick={() => setShowed(false)}>
            Хорошо
          </Button>
        </AnimateIn>
      </div>
    </div>
  )
}

export default NewPlanGuide