import {useEffect, useState} from "react";

interface BlurredCircleProps {
  colors: string[]
}

interface ColorStyle {
  backgroundColor: string
}

const BlurredCircle = ({colors}: BlurredCircleProps) => {
  const [style, setStyle] = useState<ColorStyle>({
    backgroundColor: colors[Math.floor(Math.random() * colors.length)]
  })

  useEffect(() => {
    const colorChangeInterval = setInterval(() => {
      setStyle({
        backgroundColor: colors[Math.floor(Math.random() * colors.length)]
      })
    }, 3000)

    return () => {
      clearInterval(colorChangeInterval)
    }
  }, []);

  return (
    <div style={style} className="w-96 h-96 blur-[500px] transition animate-spin-in origin-right"></div>
  )
}

export default BlurredCircle