import React from 'react'
import { SignUp } from '@clerk/nextjs'
import Header2 from '../Components/Header2'
import Link from 'next/link'

const signUp = () => {
    return (
        <>
            <Header2 />
            <main className='flex justify-center items-center p-5 md:p-10'>
                <div className='flex flex-col justify-center space-y-5 items-center'>
                    <Link href="signIn"><button className='bg-[#3563E9] w-full px-[120px] lg:px-[115px] py-2 rounded-lg shadow-lg text-center text-xl md:text-2xl lg:text-3xl text-white font-bold'>Sign In</button></Link>
                    <SignUp />
                </div>
            </main>
        </>
    )
}

export default signUp
