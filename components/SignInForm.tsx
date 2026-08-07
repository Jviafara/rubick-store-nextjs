'use client'
import { signIn } from '@/lib/auth/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import LoadingThreeDotsPulse from './LoadingThreeDotsPulse'

const SignInForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const router = useRouter()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn.email({ email, password })
      if (result.error) {
        setError(result.error.message ?? 'Error al iniciar sesión, Intenta nuevamente.')
      } else {
        router.push('/')
      }
    } catch (e) {
      console.error('Error during sign-in:', e)
      setError('Error al iniciar sesión, Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <>
      <form
        className='space-y-4 w-full text-main'
        onSubmit={handleSubmit}
      >
        <div className='space-y-4 px-6'>
          {/* Email */}
          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='text-sm font-medium'
            >
              E-mail
            </label>

            <input
              id='email'
              type='email'
              placeholder='john@example.com'
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className={`w-full rounded-2xl border border-primary px-3 py-2 outline-none ${error && 'border-secondary'}`}
            />
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <label
              htmlFor='password'
              className='text-sm font-medium '
            >
              Password
            </label>

            <input
              id='password'
              type='password'
              placeholder='Enter your password'
              required
              minLength={8}
              value={password}
              onChange={e => setPassword(e.target.value)}
              className={`w-full rounded-2xl border border-primary px-3 py-2 outline-none ${error && 'border-secondary'}`}
            />
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col space-y-4 px-6 w-full justify-center items-center'>
          {/*  Error  */}
          {error && <div className='text-sm text-red-600'>{error}</div>}
          <button
            type='submit'
            disabled={loading}
            className={`w-1/2 bg-primary hover:bg-primary/90 px4 py-2 rounded-2xl text-lg font-medium  ${loading && 'bg-transparent!'} ${password.length < 8 && 'bg-disabled!'}`}
          >
            {loading ? <LoadingThreeDotsPulse /> : 'Sign In'}
          </button>

          <p className='text-center text-sm text-muted  flex flex-col xs:flex-row justify-center items-center xs:gap-2'>
            <span>Don&apos;t have an account?</span>
            <Link
              href='/sign-up'
              className='font-semibold text-primary hover:underline ml-2'
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </>
  )
}

export default SignInForm
