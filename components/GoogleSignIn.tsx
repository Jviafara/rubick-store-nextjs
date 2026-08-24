import { signIn } from '@/lib/auth/auth-client'
import Image from 'next/image'

const GoogleSignIn = ({ type }: { type: string }) => {
  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({ provider: 'google' })
    } catch (e) {
      console.error('Error during sign-in:', e)
    } finally {
    }
  }
  return (
    <button
      type='button'
      onClick={() => handleGoogleSignIn()}
      className={`flex w-full cursor-pointer items-center justify-center gap-2 rounded-2xl  py-3 transition ${type === 'primary' ? 'hover:bg-primary' : 'hover:bg-secondary'}/20`}
    >
      <Image
        src='/google.png'
        alt='Google Icon'
        width={14}
        height={14}
        className='h-5 w-5'
      />

      <p className='font-semibold'>Sign In with Google</p>
    </button>
  )
}

export default GoogleSignIn
