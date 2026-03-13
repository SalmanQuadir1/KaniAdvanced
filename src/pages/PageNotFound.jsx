import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

const PageNotFound = () => {

    const navigate= useNavigate()
    return (
        <div className='relative w-full h-screen flex items-center justify-center'>
            <img
                src='/img/pagenot.jpg'
                alt='Page Not Found'
                className='object-cover w-full h-full'
            />

            {/* Button at the top */}
           

            {/* Button at the bottom center */}
            <button onClick={()=>navigate("/")} className='absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10 bg-blue-500 w-[200px] text-white p-2 rounded'>
               Home
            </button>
        </div>

    )
}

export default PageNotFound
