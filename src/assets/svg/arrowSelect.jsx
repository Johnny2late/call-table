import React from 'react'

const ArrowSelect = ({ fill = '#ADBFDF', width = '10', height = '6' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 10 6`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.8"
        d="M1.175 0.589966L5 4.29847L8.825 0.589966L10 1.73167L5 6.58997L0 1.73167L1.175 0.589966Z"
        fill={fill}
      />
    </svg>
  )
}

export default ArrowSelect
