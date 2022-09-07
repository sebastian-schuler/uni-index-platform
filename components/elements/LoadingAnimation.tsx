import React from 'react'

const LoadingAnimation = () => {
    return (
        <div style={{height: "calc(100vh - 60px)"}} className='flex'>
        <div className='flex flex-col items-center justify-center m-auto'>
            <div style={{ "borderTopColor": "transparent" }}
                className="w-16 h-16 border-4 border-blue-400 border-solid rounded-full animate-spin" />
            <span className='mt-4'>Loading</span>
        </div>
        </div>
    )
}

export default LoadingAnimation