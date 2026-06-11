import { CircleAlert } from 'lucide-react'
import Link from 'next/link'

const NotFound = () => {
  return (
    <div className='h-screen flex items-center justify-center'>
      <div className='w-full md:w-[50%] lg:w-[30%] flex flex-col items-center justify-center gap-4 rounded-xl bg-red-300 p-6'>
        <CircleAlert
          size={32}
          color='red'
        />
        <p className='text-2xl text-center flex justify-center text-red-700'>Page not found!</p>
        <p className='text-2xl'>
          Return to{' '}
          <Link
            href={'/'}
            className='underline text-blue-500'
          >
            Home Page
          </Link>
          .
        </p>
      </div>
    </div>
  )
}

export default NotFound
