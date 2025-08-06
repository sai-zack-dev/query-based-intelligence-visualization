import React from 'react'

function Footer() {
  return (
    <div className='fixed w-full h-10 bottom-0 left-0 backdrop-blur-sm bg-white/20 flex justify-between items-center px-5 text-xs text-gray-400'>
        <span>Version Alpha 1.0.0</span>
        <span>FYP 2025 @ MDIS | Teeside University</span>
        <span>Developed by <a href="https://github.com/sai-zack-dev" className='text-blue-400 underline'>SaiZ</a></span>
    </div>
  )
}

export default Footer