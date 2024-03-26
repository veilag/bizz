import {useNavigate} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-8">
      <div className="flex flex-col gap-1 items-center justify-center">
        <h3 className="text-6xl font-black">404</h3>
        <h2 className="font-semibold text-xl">Страница не найдена</h2>
      </div>

      <div className="flex flex-col w-64">
        <Button className="w-full" onClick={() => navigate("/", {
          replace: true
        })} >На главный экран</Button>
      </div>
    </div>
  )
}

export default NotFound