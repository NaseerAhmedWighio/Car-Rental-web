"use client"
import { AuthenticateWithRedirectCallback } from '@clerk/nextjs'

export default function SSOCallback() {
    return (
        <div className='flex justify-center items-center min-h-screen bg-[#F6F7F9]'>
            <AuthenticateWithRedirectCallback />
        </div>
    )
}
