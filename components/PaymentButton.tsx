'use client'

import { IOrder } from '@/lib/types'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useState } from 'react'
import StripeCheckout from './StripeCheckout'

const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const PaymentButton = ({ order }: { order: IOrder }) => {
  const [openPaymentForm, setOpenPaymentForm] = useState(false)

  return (
    <div>
      <Elements
        stripe={stripe}
        options={{ mode: 'payment', amount: order.totalPrice * 100, currency: 'usd' }}
      >
        {openPaymentForm ? (
          <StripeCheckout
            amount={order.totalPrice}
            orderId={order._id.toString()}
          />
        ) : (
          <button
            type='button'
            className='rounded-lg border bg-blue-600 p-2 px-4  w-full text-white font-bold text-lg'
            onClick={() => setOpenPaymentForm(true)}
          >
            Pay now
          </button>
        )}
      </Elements>
    </div>
  )
}

export default PaymentButton
