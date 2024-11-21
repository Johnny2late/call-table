import React from 'react'

const Stop = ({ fill = '#002CFB', width = '8', height = '8' }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 8 8`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 8H2.66667V0H0V8ZM5.33333 0V8H8V0H5.33333Z" fill={fill} />
    </svg>
  )
}

export default Stop
