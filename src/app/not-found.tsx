import React from 'react'
import Link from 'next/link'

const error = () => {
  return (
      <div className='w-full min-h-[60vh] flex justify-center items-center px-4 py-20'>
        <div className='text-center'>
          <h1 className='uppercase text-4xl text-red-500 font-bold'>404 - Page Not Found</h1>
          <p className="text-[16px] mt-2">The page you are looking for does not exist</p>
          <Link href="/"><button className='bg-blue-500 rounded-lg text-xl text-white px-5 py-2 mt-10 hover:bg-blue-700'>
            Go back to home page
          </button>
          </Link>
        </div>
      </div>
  )
}

export default error
