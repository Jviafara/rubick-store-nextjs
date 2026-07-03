'use client'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IOrder } from '@/lib/types'
import { getDate } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Container from './Container'
import Link from 'next/link'

const OrderList = ({ max }: { max?: number }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [orders, setOrders] = useState<IOrder[]>([])

  useEffect(() => {
    const getOrders = async () => {
      dispatch(setGlobalLoading(true))

      const { res, error } = await OrdersApi.getListUser()

      dispatch(setGlobalLoading(false))

      if (error) toast.error(res.message)
      if (res) {
        if (max) {
          setOrders(res.sort((a: IOrder, b: IOrder) => getDate(b).getTime() - getDate(a).getTime()).slice(0, 4))
        } else {
          setOrders(res.sort((a: IOrder, b: IOrder) => getDate(b).getTime() - getDate(a).getTime()))
        }
      }
    }
    getOrders()
  }, [dispatch, max])

  if (orders.length <= 0) return null

  return (
    <Container
      header={'Orders'}
      seeMore={max ? '/orders' : ''}
    >
      <div className='hidden md:inline-flex '>
        <ul className='w-[95vw] lg:w-[90vw]  flex flex-col gap-2'>
          {orders.map(order => (
            <li
              key={order._id.toString()}
              className='w-full border border-pink rounded-xl flex items-center justify-between py-2 px-4 bg-gray-200 bg-opacity-50 backdrop-blur-2xl'
            >
              <div className='flex justify-between items-center xl:gap-5 w-1/3 lg:w-[40%] '>
                <p className='truncate w-full'>
                  <strong>ID:</strong> {order._id.toString()}
                </p>
                <div className='flex flex-col lg:flex-row lg:gap-4 lg:justify-evenly items-center w-full'>
                  <p>
                    <strong>Price:</strong> ${order.totalPrice}
                  </p>
                  <p className='flex flex-col xl:flex-row items-center'>
                    <strong>Date:</strong>
                    <span>{order.createdAt!.toString().slice(0, 10)}</span>
                  </p>
                </div>
              </div>
              <div className='w-1/4 lg:w-[20%] flex justify-center'>
                {order.isPaid ? (
                  <p
                    className='min-w-fit border border-green-300 rounded-lg shadow-sm shadow-green-300
                         bg-green-200 p-1 font-bold text-green-800 px-4 py-2'
                  >
                    Order Paid
                  </p>
                ) : (
                  <Link
                    href={`/orders/${order._id}`}
                    className='border min-w-fit border-red-300 rounded-lg shadow-sm shadow-red-300
                         bg-red-200 p-1 font-bold text-red-800 px-4 py-2'
                  >
                    Go to pay
                  </Link>
                )}
              </div>
              <div className='w-1/4 lg:w-[20%] flex justify-center'>
                {order.isDelivered ? (
                  <p
                    className='min-w-fit border border-green-300 rounded-lg shadow-sm shadow-green-300
                         bg-green-200 p-1 font-bold text-green-800 px-4 py-2'
                  >
                    Order Delivered
                  </p>
                ) : (
                  <p
                    className='border min-w-fit border-red-300 rounded-lg shadow-sm shadow-red-300
                         bg-red-200 p-1 font-bold text-red-800 px-4 py-2'
                  >
                    Waiting Delivery
                  </p>
                )}
              </div>

              <div className='w-[8%]'>
                <button
                  type='button'
                  onClick={() => router.push(`/orders/${order._id}`)}
                  className='rounded-lg border hover:bg-blue-500 bg-yellow p-2
                    text-black font-medium font-roboto '
                >
                  Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className='md:hidden'>
        <ul className='w-[90vw]  flex flex-col gap-3'>
          {orders.map(order => (
            <li
              key={order._id.toString()}
              className='border rounded-xl border-pink flex items-center gap-3 p-2 bg-gray-200 bg-opacity-50 backdrop-blur-2xl'
            >
              <div className='w-full flex flex-col gap4'>
                <div className='flex flex-col sm:flex-row sm:gap-3 sx:items-center'>
                  <p className='truncate'>
                    <strong>ID:</strong> {order._id.toString()}
                  </p>
                  <p className='flex gap-1'>
                    <strong>Date:</strong>
                    <span>{order.createdAt!.toString().slice(0, 10)}</span>
                  </p>
                </div>

                <div className='w-full flex flex-col sm:flex-row gap-4 sm:items-center'>
                  <p>
                    <strong>Price:</strong> ${order.totalPrice}
                  </p>
                  {order.isPaid ? (
                    <p
                      className='min-w-fit border border-green-300 rounded-lg shadow-sm shadow-green-300
                         bg-green-200 p-1 font-bold text-green-800 text-center sm:mt-2'
                    >
                      Order Paid
                    </p>
                  ) : (
                    <Link
                      href={`/orders/${order._id}`}
                      className='border min-w-fit border-red-300 rounded-lg shadow-sm shadow-red-300
                         bg-red-200 p-1 font-bold text-red-800 px-4 py-2'
                    >
                      Go to pay
                    </Link>
                  )}

                  {order.isDelivered ? (
                    <p
                      className='min-w-fit text-center border border-green-300 rounded-lg shadow-sm shadow-green-300
                         bg-green-200 p-1 font-bold text-green-800 sm:mt-2'
                    >
                      Order Delivered
                    </p>
                  ) : (
                    <p
                      className='border min-w-fit border-red-300 rounded-lg shadow-sm shadow-red-300
                         bg-red-200 p-1 font-bold text-red-800 text-center sm:mt-2'
                    >
                      Waiting Delivery
                    </p>
                  )}
                  <button
                    type='button'
                    onClick={() => router.push(`/orders/${order._id}`)}
                    className='w-[60vw] mx-auto sm:hidden rounded-lg border hover:bg-blue-500 bg-yellow py-3 px-4
                    text-black font-medium font-serif '
                  >
                    Details
                  </button>
                </div>
              </div>
              <div className='hidden sm:inline-flex w-1/4'>
                <button
                  type='button'
                  onClick={() => router.push(`/orders/${order._id}`)}
                  className='w-full rounded-lg border hover:bg-blue-500 bg-yellow py-3 px-4
                    text-black font-medium font-serif '
                >
                  Details
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Container>
  )
}

export default OrderList
