'use client'
import GoogleSignIn from '@/components/GoogleSignIn'
import Logo from '@/components/Logo'
import SignUpForm from '@/components/SignUpForm'
import { useSession } from '@/lib/auth/auth-client'
import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const SignUp = () => {
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (session?.user) {
      router.push('/')
    }
  }, [session, router])

  return (
    <div className=' h-screen w-screen flex items-center justify-center'>
      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className='w-[90%] md:max-w-150 absolute top-[20%] translate-y-[-20%] md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 flex flex-col gap-4 items-center justify-center rounded-xl bg-gray-300/70 p-4'
      >
        {/*  Header */}
        <div className='space-y-1 w-full flex flex-col items-center justify-center'>
          <div className='mb-4 flex justify-center'>
            <Logo />
          </div>
          <h2 className='text-2xl font-bold text-black'>Sign Up</h2>
          <p className='text-sm text-center text-gray-500'>Create a new account</p>
        </div>
        {/* Form */}
        <SignUpForm />

        {/* Footer */}
        <div className='flex w-full flex-col items-center justify-center  px-6'>
          <GoogleSignIn />
        </div>
      </motion.div>
    </div>
  )
}

export default SignUp
