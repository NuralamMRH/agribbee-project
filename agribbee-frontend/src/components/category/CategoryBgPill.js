import React from "react"

const CategoryBgPill = ({ width, height, fill, style }) => {
  return (
    <svg
      width={width ? width : "252"}
      height={height ? height : "60"}
      viewBox="0 0 252 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={style}
    >
      <rect width="243" height="60" rx="8" fill={fill ? fill : "#377E01"} />
      <path
        d="M247.5 27C243.1 25.4 243 23 243 20V17H240.5V25L240 46L243 42.5C242.6 38.1 246 35.6667 247.5 35C254.7 31.8 250.5 28.3333 247.5 27Z"
        fill={fill ? fill : "#377E01"}
      />
    </svg>
  )
}

export default CategoryBgPill
