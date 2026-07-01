import { useSession } from '@/lib/auth/auth-client'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IOrder } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
// import StripeCheckout from 'react-stripe-checkout'

const PaymentButton = ({ order }: { order: IOrder }) => {
  const { data: session } = useSession()

  const router = useRouter()
  const dispatch = useAppDispatch()

  const handleToken = async (total: number, token: string) => {
    dispatch(setGlobalLoading(true))

    const { res, error } = await OrdersApi.orderPayment({
      orderId: order._id.toString(),
      token,
      amount: total,
    })
    dispatch(setGlobalLoading(false))

    if (error) toast.error(res.message)

    if (res) {
      router.refresh()
    }
  }

  const tokenHandler = (token: string) => {
    handleToken(order.totalPrice, token)
  }
  return (
    <div>
      {/* <StripeCheckout
        name='Payment'
        email={user.email}
        amount={order?.totalPrice * 100}
        description={`Payment order: ${order?.id}`}
        token={tokenHandler}
        stripeKey='pk_test_51NGzQhAWaH59OtvEbobT1NiRqKYk9Q6C5FLgWEvs4CcEz23nkODRsyBEo7hkYhMlccQcVEJ9hTV3fkUxZYQmJJl100Qeg9dxqt'
      >
        <button
          type='button'
          className='rounded-lg border bg-blue-600 p-2 px-4  w-full text-white font-bold text-lg'
        >
          Pay now
        </button>
      </StripeCheckout> */}
    </div>
  )
}

export default PaymentButton
