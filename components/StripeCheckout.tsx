import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { clearCart } from '@/lib/redux/features/cartSlice'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IOrder } from '@/lib/types'
import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

interface StripeCheckoutProps {
  amount: number
  createOrder: () => Promise<IOrder>
}

const StripeCheckout = ({ amount, createOrder }: StripeCheckoutProps) => {
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useAppDispatch()
  const router = useRouter()

  const [clientSecret, setClientSecret] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>()
  const { globalLoading } = useAppSelector(state => state.globalLoading)

  // Create payment Intent
  useEffect(() => {
    const createPaymentIntent = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await OrdersApi.orderPayment({
        amount: amount * 100,
        type: 'payment_intent',
      })
      dispatch(setGlobalLoading(false))

      if (res?.status || error) {
        toast.error(res?.message || 'Failed to create payment intent.')
      }

      if (res) {
        setClientSecret(res.clientSecret)
      }
    }
    createPaymentIntent()
  }, [amount, dispatch])

  const handleErrorsAndSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!stripe || !elements) {
      return
    }

    dispatch(setGlobalLoading(true))
    setErrorMessage(undefined)

    const { error: submitError } = await elements.submit()
    if (submitError) {
      setErrorMessage(submitError.message)
      dispatch(setGlobalLoading(false))
      return
    }

    const order = await createOrder()

    const result = await stripe.confirmPayment({
      elements,
      clientSecret,
      confirmParams: { return_url: `${window.location.origin}/orders` },
      redirect: 'if_required',
    })
    if (result.error) {
      setErrorMessage(result.error.message)
      dispatch(setGlobalLoading(false))
      return
    }

    if (result.paymentIntent?.status === 'succeeded') {
      const { res, error } = await OrdersApi.orderPayment({
        orderId: order._id.toString(),
        amount: amount * 100,
        type: 'payment_confirmation',
        paymentId: result.paymentIntent.id,
      })

      if (res?.status || error) {
        toast.error(res?.message || 'Payment confirmation failed.')
      } else {
        toast.success('Payment successful!')
      }
    }

    dispatch(setGlobalLoading(false))
    dispatch(clearCart())
    router.push(`/checkout?step=3&order=${order._id.toString()}`)
  }

  return (
    <form
      onSubmit={handleErrorsAndSubmit}
      className='flex flex-col gap-4'
    >
      <PaymentElement />
      {errorMessage && <div className='text-red-500'>{errorMessage}</div>}
      <button
        // disabled={!stripe || !elements}
        type='submit'
        className='rounded-lg border bg-blue-600 p-2 px-4  w-full text-white font-bold text-lg disabled:opacity-50 disabled:bg-gray-500'
      >
        {globalLoading ? 'Processing...' : `Pay ${amount.toFixed(2)}`}
      </button>
    </form>
  )
}

export default StripeCheckout
