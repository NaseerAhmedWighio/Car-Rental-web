import React from 'react'
import Header2 from './Components/Header2'
import Link from 'next/link'

const error = () => {
  return (
    <>
      <Header2 />
      <div className='w-full h-[350px] bg-slate-100 flex justify-center items-center'>
        <div className='text-center'>
          <h1 className='uppercase text-4xl text-red-500 font-bold'>404 - Page Not Found</h1>
          <p className="text-[16px] mt-2">The page you are looking for does not exist</p>
          <Link href="/"><button className='bg-blue-500 rounded-lg text-xl text-white px-5 py-2 mt-10 hover:bg-blue-700'>
            Go back to home page
          </button>
          </Link>
        </div>
      </div>
    </>
  )
}

export default error
