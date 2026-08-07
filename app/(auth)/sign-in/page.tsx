'use client'
import Logo from '@/components/Logo'
import { motion } from 'framer-motion'
import GoogleSignIn from '@/components/GoogleSignIn'
import SignInForm from '@/components/SignInForm'
import { useSession } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const SignIn = () => {
  const { data: session } = useSession()

  const router = useRouter()
  useEffect(() => {
    if (session?.user) {
      router.push('/')
    }
  }, [session, router])

  return (
    <div className='h-[calc(100vh-72px)] max-w-screen  top-0 flex items-center justify-center text-main'>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-[90%] md:max-w-150 flex absolute top-[20%] translate-y-[-20%] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 h-fit flex-col gap-4 items-center justify-center rounded-xl bg-surface p-4'
      >
        {/*  Header */}
        <div className='space-y-1 w-full flex flex-col items-center justify-center'>
          <div className='mb-4 flex justify-center'>
            <Logo />
          </div>
          <h2 className='text-2xl font-bold text-gradient-emerald-cyan'>Sign In</h2>
          <p className='text-sm text-center text-muted'>Enter your email and password</p>
        </div>
        {/* Form */}
        <SignInForm />

        <div className='w-full h-0 border-t border-main' />

        {/* Footer */}
        <div className='flex w-full flex-col items-center justify-center px-6'>
          <GoogleSignIn type={'primary'} />
        </div>
      </motion.div>
    </div>
  )
}

export default SignIn
