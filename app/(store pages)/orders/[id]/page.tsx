'use client'

import OrderNotFound from '@/components/OrderNotFound'
import PaymentButton from '@/components/PaymentButton'
import PaymentStatusSelector from '@/components/PaymentStatusSelector'
import ShippingStatusSelector from '@/components/ShippingStatusSelector'
import { useSession } from '@/lib/auth/auth-client'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { FullUser, IOrder } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaNotdef } from 'react-icons/fa6'
import { FcShipped } from 'react-icons/fc'
import { FiPackage } from 'react-icons/fi'
import { toast } from 'react-toastify'

const OrderDetailsPage = () => {
  const params = useParams<{ id: string }>()
  const { data: session } = useSession()

  const dispatch = useAppDispatch()
  const [order, setOrder] = useState<IOrder | null>(null)

  const { id: orderId } = params

  useEffect(() => {
    const getOrder = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await OrdersApi.orderDetail({ orderId })
      dispatch(setGlobalLoading(false))
      console.log(res)

      if (res.status || error) {
        toast.error(res.message)
      } else {
        setOrder(res)
      }
    }
    getOrder()
  }, [orderId, dispatch])

  if (!order) {
    return (
      <div className='w-full h-full flex justify-center items-center p-8'>
        <OrderNotFound />
      </div>
    )
  }

  return (
    <div className='w-[90vw] mx-auto flex flex-col items-center justify-center'>
      <h2 className='text-center text-xl xl:text-3xl mx-5 py-4 truncate flex gap-2 justify-center'>
        Order: #<span>{orderId}</span>
      </h2>
      <div className='flex flex-col lg:flex-row gap-8 w-full'>
        <section className='w-full lg:w-[70%] flex flex-col gap-4 '>
          <div className='flex flex-col gap-2 p-6 border border-yellow rounded-lg'>
            <h1 className='text-2xl font-medium '>Shipping</h1>
            <div>
              <p className='text-lg'>
                <strong>Name:</strong> {order?.shippingAddress.name}
              </p>
              <p>
                <strong>Address:</strong> {order?.shippingAddress.address}
              </p>
            </div>
            <ShippingStatusSelector
              order={order}
              setOrder={setOrder}
              useLabel={true}
            />
          </div>
          <div className='flex flex-col gap-2 p-6 border border-yellow rounded-lg'>
            <h1 className='text-2xl font-medium '>Payment</h1>
            <PaymentStatusSelector
              order={order}
              setOrder={setOrder}
              useLabel={true}
            />
            {!order.isPaid && order.user.toString() === session?.user.id && (
              <div className='w-fit'>
                <PaymentButton order={order} />
                <h1>Demo card: 4242 4242 4242 4242 / any future date / any 3 digit CVV</h1>
              </div>
            )}
          </div>
          <div className='flex flex-col gap-2 p-6 border border-yellow rounded-lg'>
            <h1 className='text-2xl font-medium '>Items</h1>
            <div className='w-full'>
              <ul className=' flex flex-col w-full rounded-lg '>
                {order?.orderItems.map(item => (
                  <div
                    key={item.slug}
                    className='border-b last-of-type:border-none h-full'
                  >
                    <li className='flex flex-col md:flex-row  items-center gap-4 p-4'>
                      <div className='grow'>
                        <Link href={`/product/slug/${item.slug}`}>
                          <Image
                            src={item.images?.[0] || ''}
                            alt={item.name}
                            width={500}
                            height={500}
                            loading='eager'
                            className=' object-cover rounded-lg hover:scale-105'
                          />
                        </Link>
                      </div>
                      <div className='text-xl text-center font-bold flex-grow-3 w-full'>
                        <Link href={`/product/slug/${item.slug}`}>{item.name}</Link>
                      </div>
                      <div className='flex flex-col items-center gap-2 lg:flex-row w-full px-4'>
                        <div className='flex justify-center gap-2 text-2xl grow w-37.5'>
                          <span>{item.quantity}</span>{' '}
                        </div>
                        <div className='grow w-full text-center'>
                          <p className='text-xl font-bold'>${item.price}</p>
                        </div>
                      </div>
                    </li>
                  </div>
                ))}
              </ul>
            </div>
          </div>
        </section>
        <section className='w-full lg:w-[30%] flex flex-col xl:mx-4 xl:px-6 gap-4'>
          <div className='flex flex-col gap-2 p-6 border border-yellow rounded-lg'>
            <h1 className='text-2xl font-medium mb-2'>Order Summary</h1>
            <div className='flex justify-between px-4 lg:p-0 text-2xl'>
              <div className='w-2/3'>
                <p>Items</p>
              </div>
              <p>${order?.itemsPrice}</p>
            </div>
            <hr className='border border-yellow' />
            <div className='flex justify-between px-4 lg:p-0 text-2xl'>
              <div className='w-2/3'>
                <p>Shipping</p>
              </div>
              <p>${order?.shippingPrice}</p>
            </div>
            <hr className='border border-yellow' />
            <div className='flex justify-between px-4 lg:p-0 text-2xl font-bold'>
              <div className='w-2/3'>
                <p>Order Total</p>
              </div>
              <p>${order?.totalPrice}</p>
            </div>
          </div>
          {order?.isPaid && session?.user.id === order.user.toString() && (
            <div className='flex flex-col gap-3'>
              <Link
                href={'/products'}
                type='button'
                className='rounded-lg border hover:bg-blue-600 bg-yellow p-2 w-full text-center text-white font-bold text-lg'
              >
                Continue Shopping!
              </Link>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}

export default OrderDetailsPage
