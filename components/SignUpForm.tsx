import { signUp } from '@/lib/auth/auth-client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const SignUpForm = () => {
  const [name, setName] = useState('')
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
      const result = await signUp.email({ email, password, name })
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
        className='space-y-4 w-full'
        onSubmit={handleSubmit}
      >
        <div className='space-y-4 px-6'>
          {/*  Error  */}
          {error && <div className='rounded-md bg-red-100 p-3 text-sm text-red-600'>{error}</div>}

          {/* Name */}
          <div className='space-y-2'>
            <label
              htmlFor='name'
              className='text-sm font-medium text-black'
            >
              Name
            </label>

            <input
              id='name'
              type='name'
              placeholder='Enter your Name...'
              required
              value={name}
              onChange={e => setName(e.target.value)}
              className='w-full rounded-md border border-gray-400 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            />
          </div>

          {/* Email */}
          <div className='space-y-2'>
            <label
              htmlFor='email'
              className='text-sm font-medium text-black'
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
              className='w-full rounded-md border border-gray-400 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            />
          </div>

          {/* Password */}
          <div className='space-y-2'>
            <label
              htmlFor='password'
              className='text-sm font-medium text-black'
            >
              Contraseña
            </label>

            <input
              id='password'
              type='password'
              placeholder='Ingresa tu contraseña'
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              minLength={8}
              className='w-full rounded-md border border-gray-400 px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500'
            />
          </div>
        </div>

        {/* Actions */}
        <div className='flex flex-col space-y-4 px-6 pb-6'>
          <button
            type='submit'
            disabled={loading}
            className={`w-full rounded-md  ${loading || password.length < 8 ? 'bg-gray-400' : 'bg-secondary/70 transition hover:bg-primary cursor-pointer'}  py-2 text-lg font-medium text-white `}
          >
            {loading ? 'Signing up...' : 'Sign Up'}
          </button>

          <p className='text-center text-sm text-gray-500'>
            Already have an account?
            <Link
              href='/sign-in'
              className='font-semibold text-blue-600 hover:underline ml-2'
            >
              Sign In
            </Link>
          </p>
        </div>
      </form>
    </>
  )
}

export default SignUpForm
