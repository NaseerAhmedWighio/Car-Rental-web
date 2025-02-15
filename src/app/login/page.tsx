import React from 'react'
import { SignIn, SignInButton } from '@clerk/nextjs'
import Header2 from '../Components/Header2'

const login = () => {
    return (
        <>
            <Header2 />
                <main className='flex justify-center items-center p-10'>
                <SignIn />
            </main>
        </>
    )
}

export default login
