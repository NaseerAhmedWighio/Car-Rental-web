import React from 'react'
import { SignIn } from '@clerk/nextjs'
import Header2 from '../Components/Header2'

const login = () => {
    return (
        <>
            <Header2 />
            <main className='flex justify-center items-center p-5 md:p-10'>
                <div className='flex flex-col justify-center space-y-5 items-center'>
                    <h1 className='bg-[#3563E9] w-full px-0 md:px-5 py-2 rounded-lg text-center text-2xl md:text-3xl lg:text-4xl text-white font-bold'>
                        Sign In First to access <span className='text-white'>{`  MORENT`}</span>
                    </h1>
                    <SignIn />
                </div>
            </main>
        </>
    )
}

export default login
