interface IconProps {
  className?: string | undefined
  light?: boolean
}

const TelegramLogo = ({className = undefined}: IconProps) => {
  return (
    <svg width={20} height={20} className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240.1 240.1">
      <circle className="dark:fill-white fill-neutral-900" fillRule="evenodd" clipRule="evenodd" cx="120.1" cy="120.1" r="120.1"/>
      <path className="dark:fill-neutral-900 fill-white" fillRule="evenodd" clipRule="evenodd" d="M54.3,118.8c35-15.2,58.3-25.3,70-30.2 c33.3-13.9,40.3-16.3,44.8-16.4c1,0,3.2,0.2,4.7,1.4c1.2,1,1.5,2.3,1.7,3.3s0.4,3.1,0.2,4.7c-1.8,19-9.6,65.1-13.6,86.3 c-1.7,9-5,12-8.2,12.3c-7,0.6-12.3-4.6-19-9c-10.6-6.9-16.5-11.2-26.8-18c-11.9-7.8-4.2-12.1,2.6-19.1c1.8-1.8,32.5-29.8,33.1-32.3 c0.1-0.3,0.1-1.5-0.6-2.1c-0.7-0.6-1.7-0.4-2.5-0.2c-1.1,0.2-17.9,11.4-50.6,33.5c-4.8,3.3-9.1,4.9-13,4.8 c-4.3-0.1-12.5-2.4-18.7-4.4c-7.5-2.4-13.5-3.7-13-7.9C45.7,123.3,48.7,121.1,54.3,118.8z"/>
    </svg>
  )
}

const Logo = ({className = undefined, light = false}: IconProps) => {
  if (light) return (
    <svg className={className} width="1484" height="1484" viewBox="0 0 1484 1484" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <circle cx="742" cy="742" r="643.434" className="stroke-white" strokeWidth="102.132"/>
      <path fillRule="evenodd" clipRule="evenodd" className="fill-white"
            d="M1076.64 643.759L912.953 601.32L1130.87 446.799L1395.95 515.524L1355.85 670.194L1368.11 687.487L1347.59 702.036L1344.69 713.251L1335.23 710.801L959.979 976.891L1263.58 1056.93L1211.51 1254.45L485.767 1063.12L688.407 919.425L688.231 919.178L1076.64 643.759ZM816.568 544.462L1001.57 413.278L292.919 229.553L241.657 427.281L525.128 500.773L153.518 764.278L140.123 760.747L88.0508 958.263L357.053 1029.18L574.22 875.191L410.945 832.146L816.596 544.502L816.568 544.462Z"
      />
    </svg>
  )

  return (
    <svg className={className} width="1484" height="1484" viewBox="0 0 1484 1484" fill="none"
         xmlns="http://www.w3.org/2000/svg">
      <circle cx="742" cy="742" r="643.434" className="stroke-neutral-900 dark:stroke-white" strokeWidth="102.132"/>
      <path fillRule="evenodd" clipRule="evenodd" className="fill-neutral-900 dark:fill-white"
            d="M1076.64 643.759L912.953 601.32L1130.87 446.799L1395.95 515.524L1355.85 670.194L1368.11 687.487L1347.59 702.036L1344.69 713.251L1335.23 710.801L959.979 976.891L1263.58 1056.93L1211.51 1254.45L485.767 1063.12L688.407 919.425L688.231 919.178L1076.64 643.759ZM816.568 544.462L1001.57 413.278L292.919 229.553L241.657 427.281L525.128 500.773L153.518 764.278L140.123 760.747L88.0508 958.263L357.053 1029.18L574.22 875.191L410.945 832.146L816.596 544.502L816.568 544.462Z"
      />
    </svg>
  )
}

export {
  TelegramLogo,
  Logo
}