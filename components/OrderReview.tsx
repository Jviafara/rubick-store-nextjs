import { IFullOrder } from '@/lib/types'
import OrderSummary from './OrderSummary'
import PaymentButton from './PaymentButton'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useParams, usePathname, useSearchParams } from 'next/navigation'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import Link from 'next/link'
import { FaClipboardList } from 'react-icons/fa'
import { useSession } from '@/lib/auth/auth-client'
import ShippingStatusSelector from './ShippingStatusSelector'
import OrderNotFound from './OrderNotFound'

const OrderReview = () => {
  const searchParams = useSearchParams()
  const params = useParams<{ id: string }>()
  const pathname = usePathname()
  const { data: session } = useSession()

  const orderId = searchParams.get('order') || params.id

  const [order, setOrder] = useState<IFullOrder | null>(null)

  useEffect(() => {
    const getOrder = async () => {
      const { res, error } = await OrdersApi.orderDetail({ orderId })

      if (res.status || error) {
        toast.error(res.message)
        return
      }
      setOrder(res)
    }
    getOrder()
  }, [orderId])

  if (!order) {
    return (
      <div className='w-full h-full flex justify-center items-center p-8'>
        <OrderNotFound />
      </div>
    )
  }

  return (
    <div className='w-full xl:max-w-[70%] flex flex-col lg:grid lg:grid-cols-2 gap-4 text-main '>
      <div className='w-full h-fit col-span-1'>
        <OrderSummary order={order} />
      </div>
      <div className='w-full h-fit col-span-1 flex flex-col gap-4'>
        <section className='w-full flex flex-col gap-2 border border-muted rounded-2xl bg-surface/70 px-4 py-4 '>
          <div className='w-full flex justify-between items-center'>
            <h1 className='font-plus-jakarta-sans'>
              Delivered to <span className='font-semibold uppercase'>{order.shippingAddress?.name}</span>
            </h1>
          </div>
          <div className='flex flex-col gap-0'>
            <p>
              {order.shippingAddress?.address} - {order.shippingAddress?.phone}
            </p>
            <p>
              {order.shippingAddress?.city} - {order.shippingAddress?.country}
            </p>
            <p>{order.shippingAddress?.postalCode}</p>
          </div>
        </section>
        <section className='w-full flex flex-col gap-2 border border-muted rounded-2xl bg-surface/70 px-4 py-4 '>
          {!order?.isPaid ? (
            <PaymentButton />
          ) : (
            <div className='w-full flex flex-col gap-4'>
              <div className='flex flex-col gap-2'>
                <h1>Payment status:</h1>
                <h1 className='w-fit rounded-2xl text-center text-tertiary font-extrabold bg-tertiary/10 px-4 py-2 uppercase'>Order Paid!</h1>
              </div>

              <div className='flex flex-col gap-2'>
                <h1>Shipping status:</h1>
                <ShippingStatusSelector
                  order={order}
                  setOrder={setOrder}
                  useLabel={true}
                />
              </div>
            </div>
          )}
        </section>
        {order?.isPaid && session?.user.id === order.user.toString() && !pathname.includes('order') && (
          <div className='flex flex-col justify-evenly md:flex-row items-center space-x-4'>
            <Link
              href={'/products'}
              className='rounded-2xl action-button text-lg! px-4 py-2 text-nowrap'
            >
              Continue Shopping
            </Link>
            <Link
              href={'/profile?tab=orders'}
              className='rounded-2xl gradient-button text-lg! px-4 py-2 text-nowrap'
            >
              <FaClipboardList />
              See all orders
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}

export default OrderReview
