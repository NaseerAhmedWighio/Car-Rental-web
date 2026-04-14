"use client"
import { useState, useEffect } from 'react'
import { useSignIn } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import Koeng from '@/Public/Koeng.png'

export default function SignInPage() {
    const { signIn, isLoaded, setActive } = useSignIn()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const [carStage, setCarStage] = useState<'enter' | 'center' | 'exit'>('enter')
    const [showForm, setShowForm] = useState(false)

    useEffect(() => {
        const t1 = setTimeout(() => setCarStage('center'), 1400)
        const t2 = setTimeout(() => setCarStage('exit'), 2400)
        const t3 = setTimeout(() => setShowForm(true), 3000)
        return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
    }, [])

    const handleOAuthSignIn = async (strategy: string) => {
        if (!isLoaded) return
        try {
            await signIn.authenticateWithRedirect({
                strategy: strategy as any,
                redirectUrl: '/sso-callback',
                redirectUrlComplete: '/'
            })
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'Failed to sign in')
        }
    }

    const handleEmailSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!isLoaded || !email || !password) return
        setLoading(true)
        setError('')
        try {
            const result = await signIn.create({ identifier: email, password })
            if (result.status === 'complete') {
                await setActive({ session: result.createdSessionId })
                router.push('/')
            }
        } catch (err: any) {
            setError(err.errors?.[0]?.message || 'Invalid email or password')
        } finally { setLoading(false) }
    }

    const socialProviders = [
        { name: 'Google', strategy: 'oauth_google', icon: 'google', bg: 'hover:bg-gray-50', border: 'border-gray-200' },
        { name: 'Facebook', strategy: 'oauth_facebook', icon: 'facebook', bg: 'hover:bg-blue-50', border: 'border-blue-200' },
        { name: 'LinkedIn', strategy: 'oauth_linkedin', icon: 'linkedin', bg: 'hover:bg-blue-50', border: 'border-blue-200' },
        { name: 'Apple', strategy: 'oauth_apple', icon: 'apple', bg: 'hover:bg-gray-50', border: 'border-gray-200' },
        { name: 'GitHub', strategy: 'oauth_github', icon: 'github', bg: 'hover:bg-gray-50', border: 'border-gray-200' },
    ]

    const carVariants = {
        enter: {
            x: '-50vw',
            opacity: 0,
            transition: { duration: 1.2, ease: 'easeOut' }
        },
        center: {
            x: 'calc(50vw - 50%)',
            opacity: 1,
            transition: { duration: 0.8, ease: 'easeOut' }
        },
        exit: {
            x: '120vw',
            opacity: 0,
            transition: { duration: 0.7, ease: 'easeInOut' }
        }
    }

    return (
        <main className='w-screen h-screen bg-[#F6F7F9] overflow-hidden relative'>
            {/* Single Car Animation - Left → Center → Right */}
            <motion.div
                variants={carVariants}
                initial='enter'
                animate={carStage}
                className='absolute inset-0 z-20 flex items-center pointer-events-none'
            >
                <div className='relative w-[220px] sm:w-[300px] md:w-[400px]'>
                    <Image src={Koeng} alt='Koengsegg' className='w-full h-auto drop-shadow-2xl' width={400} height={200} />
                </div>
            </motion.div>

            {/* Auth Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: showForm ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className='absolute inset-0 z-10 flex'
            >
                {/* Left Side - Branding */}
                <div className='hidden md:flex md:w-[45%] lg:w-[50%] flex-col justify-center px-8 lg:px-12 xl:px-20 space-y-6'>
                    <h1 className='text-[#3563E9] font-bold text-[36px] lg:text-[44px] xl:text-[52px]'>MORENT</h1>
                    <h2 className='text-[#1A202C] text-[24px] lg:text-[30px] xl:text-[36px] font-bold leading-tight'>
                        Welcome <span className='text-[#3563E9]'>back</span>
                    </h2>
                    <p className='text-[#90A3BF] text-[14px] lg:text-[16px] leading-relaxed max-w-md'>
                        Sign in to access your account, manage rentals, track bookings, and discover our premium car collection.
                    </p>
                    <div className='flex items-center gap-3'>
                        <div className='w-10 h-10 bg-[#3563E9] rounded-full flex items-center justify-center'>
                            <svg width='20' height='20' viewBox='0 0 24 24' fill='none'><path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' stroke='white' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'/></svg>
                        </div>
                        <span className='text-[#1A202C] text-[14px] lg:text-[15px] font-medium'>Trusted by 50,000+ customers</span>
                    </div>
                </div>

                {/* Right Side - Auth Card */}
                <div className='w-full md:w-[55%] lg:w-[50%] flex items-center justify-center p-4 sm:p-6 lg:p-8'>
                    <div className='w-full max-w-sm lg:max-w-md bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 space-y-4 max-h-full overflow-y-auto scrollbar-hide'>
                        <div className='text-center'>
                            <h3 className='text-[#1A202C] text-xl sm:text-2xl font-bold'>Sign In</h3>
                            <p className='text-[#90A3BF] text-xs sm:text-sm mt-1'>Continue with your preferred method</p>
                        </div>

                        {/* Social Buttons */}
                        <div className='space-y-2'>
                            {socialProviders.slice(0, 2).map(provider => (
                                <button key={provider.name} onClick={() => handleOAuthSignIn(provider.strategy)} className={`w-full flex items-center gap-3 px-4 py-2.5 border ${provider.border} ${provider.bg} rounded-xl transition-colors`}>
                                    <SocialIcon name={provider.icon} size={18} />
                                    <span className='text-[#1A202C] font-medium text-sm'>Continue with {provider.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Divider */}
                        <div className='flex items-center gap-3'>
                            <div className='flex-1 h-px bg-[#C3D4E9]'/>
                            <span className='text-[#90A3BF] text-xs font-medium'>or</span>
                            <div className='flex-1 h-px bg-[#C3D4E9]'/>
                        </div>

                        {/* More Social */}
                        <div className='grid grid-cols-3 gap-2'>
                            {socialProviders.slice(2).map(provider => (
                                <button key={provider.name} onClick={() => handleOAuthSignIn(provider.strategy)} className={`flex items-center justify-center gap-1.5 px-3 py-2.5 border ${provider.border} ${provider.bg} rounded-xl transition-colors`}>
                                    <SocialIcon name={provider.icon} size={16} />
                                    <span className='text-[#1A202C] font-medium text-[11px] sm:text-xs whitespace-nowrap'>{provider.name}</span>
                                </button>
                            ))}
                        </div>

                        {/* Email Form */}
                        <form onSubmit={handleEmailSignIn} className='space-y-3'>
                            <input type='email' value={email} onChange={e => setEmail(e.target.value)} className='w-full px-3 py-2.5 border border-[#C3D4E9] rounded-xl outline-none focus:border-[#3563E9] text-sm transition-colors' placeholder='Email address' required />
                            <input type='password' value={password} onChange={e => setPassword(e.target.value)} className='w-full px-3 py-2.5 border border-[#C3D4E9] rounded-xl outline-none focus:border-[#3563E9] text-sm transition-colors' placeholder='Password' required />
                            {error && <p className='text-red-500 text-xs'>{error}</p>}
                            <button type='submit' disabled={loading} className='w-full bg-[#3563E9] hover:bg-[#2851c7] disabled:opacity-50 text-white font-bold py-2.5 rounded-xl transition-colors text-sm'>
                                {loading ? 'Signing in...' : 'Sign In with Email'}
                            </button>
                        </form>

                        <div className='text-center text-[#90A3BF] text-xs'>
                            Don&apos;t have an account? <a href='/signup' className='text-[#3563E9] font-semibold hover:underline'>Sign Up</a>
                        </div>
                    </div>
                </div>
            </motion.div>
        </main>
    )
}

function SocialIcon({ name, size }: { name: string; size: number }) {
    const s = size
    const icons: Record<string, React.ReactNode> = {
        google: <svg width={s} height={s} viewBox='0 0 24 24'><path d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z' fill='#4285F4'/><path d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z' fill='#34A853'/><path d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z' fill='#FBBC05'/><path d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z' fill='#EA4335'/></svg>,
        facebook: <svg width={s} height={s} viewBox='0 0 24 24' fill='#1877F2'><path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z'/></svg>,
        linkedin: <svg width={s} height={s} viewBox='0 0 24 24' fill='#0A66C2'><path d='M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z'/></svg>,
        apple: <svg width={s} height={s} viewBox='0 0 24 24' fill='#000'><path d='M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z'/></svg>,
        github: <svg width={s} height={s} viewBox='0 0 24 24' fill='#333'><path d='M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z'/></svg>,
    }
    return <>{icons[name]}</>
}
