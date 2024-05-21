interface IconProps {
  className?: string | undefined
}

const Logo = ({className = undefined}: IconProps) => {
  return (
    <svg className={className}  viewBox="0 0 1484 1484" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="742" cy="742" r="643.434" className="stroke-neutral-900 dark:stroke-white" strokeWidth="102.132"/>
      <path fillRule="evenodd" clipRule="evenodd" className="fill-neutral-900 dark:fill-white"
            d="M1076.64 643.759L912.953 601.32L1130.87 446.799L1395.95 515.524L1355.85 670.194L1368.11 687.487L1347.59 702.036L1344.69 713.251L1335.23 710.801L959.979 976.891L1263.58 1056.93L1211.51 1254.45L485.767 1063.12L688.407 919.425L688.231 919.178L1076.64 643.759ZM816.568 544.462L1001.57 413.278L292.919 229.553L241.657 427.281L525.128 500.773L153.518 764.278L140.123 760.747L88.0508 958.263L357.053 1029.18L574.22 875.191L410.945 832.146L816.596 544.502L816.568 544.462Z"
      />
    </svg>
  )
}

export {
  Logo
}
