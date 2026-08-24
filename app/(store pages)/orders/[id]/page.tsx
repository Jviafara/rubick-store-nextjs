'use client'

import OrderReview from '@/components/OrderReview'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { FaAngleLeft } from 'react-icons/fa'

const OrderDetailsPage = () => {
  const params = useParams<{ id: string }>()

  const { id: orderId } = params

  return (
    <div className='w-[90%] xl:max-w-[70%] mx-auto flex flex-col items-center justify-center md:gap-8 py-8'>
      <div className='w-full flex flex-col-reverse md:flex-row justify-between gap-2'>
        <h1 className='min-w-0 max-w-full flex-1 truncate text-xl xl:text-3xl py-4'>
          Order <span>#{orderId}</span>
        </h1>
        <Link
          href={'/profile?tab=orders'}
          className='flex gap-1 items-center text-muted'
        >
          <FaAngleLeft size={16} />
          Back to orders
        </Link>
      </div>
      <OrderReview />
    </div>
  )
}

export default OrderDetailsPage
