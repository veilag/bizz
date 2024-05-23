import BlurredCircle from "./BlurredCircle.tsx";

interface GradientAnimationProps {
  count?: number
  colors?: string[]
}

const GradientAnimation = ({ count = 6, colors = ["red", "green", "blue", "yellow"] }: GradientAnimationProps) => {
  return (
    <div className="overflow-clip rounded-xl w-full h-full flex flex-wrap justify-center">
      {Array.from({length: count}).map((_, index) => (
        <BlurredCircle key={index} colors={colors} />
      ))}
    </div>
  )
}

export default GradientAnimation