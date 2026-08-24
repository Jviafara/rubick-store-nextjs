'use client'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IFullOrder, IOrder } from '@/lib/types'
import { getDate } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import Link from 'next/link'
import EmptyBanner from './EmptyBanner'
import { LuShoppingBag } from 'react-icons/lu'
import Image from 'next/image'
import ShippingStatusSelector from './ShippingStatusSelector'
import { FaChevronRight } from 'react-icons/fa'

const OrderList = ({ max }: { max?: number }) => {
  const dispatch = useAppDispatch()
  const [orders, setOrders] = useState<IFullOrder[]>([])

  useEffect(() => {
    const getOrders = async () => {
      dispatch(setGlobalLoading(true))

      const { res, error } = await OrdersApi.getListUser()

      dispatch(setGlobalLoading(false))

      if (res.status || error) toast.error(res.message)
      if (res) {
        if (max) {
          setOrders(res.sort((a: IOrder, b: IOrder) => getDate(b).getTime() - getDate(a).getTime()).slice(0, max))
        } else {
          setOrders(res.sort((a: IOrder, b: IOrder) => getDate(b).getTime() - getDate(a).getTime()))
        }
      }
    }
    getOrders()
  }, [dispatch, max])

  if (orders.length <= 0)
    return (
      <EmptyBanner
        header="Don't have any orders yet"
        Icon={LuShoppingBag}
      />
    )

  return (
    <section className='w-full flex flex-col items-center space-y-4 overflow-visible'>
      <div className='w-full flex mb-8 gap-8'>
        <h1 className='font-bold uppercase text-lg md:txt-xl lg:text-2xl font-inter max-w-fit group'>
          Order History
          <span
            className='
                  left-0
                  bottom-0
                  block
                  w-2/3
                  h-1.25
                  bg-primary
                  group-hover:w-full
                '
          />
        </h1>
        {max && (
          <div className='border border-primary text-xs sm:text-sm rounded-2xl bg-muted/20  py-2 px-4 hover:scale-105 text-nowrap'>
            <Link href={'/profile?tab=orders'}>See More</Link>
          </div>
        )}
      </div>
      {orders.map(order => (
        <div
          key={order._id.toString()}
          className='card-gradient-cyan-magenta px-4 py-4 mx-4 max-w-[90vw] w-full flex flex-col md:flex-row  gap-4 items-center'
        >
          <Link
            href={`/orders/${order._id}`}
            className='w-fit shrink-0  rounded-2xl mg:rounded-l-2xl flex justify-center'
          >
            <div className='relative w-20 aspect-square  '>
              <Image
                src={order.orderItems[0].images![0]}
                alt={'Image'}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                loading='eager'
                className='object-contain z-0 rounded-2xl p-1'
              />
            </div>
          </Link>
          <section className='flex flex-col space-y-4 md:space-y-0 space-x-8 xl:flex-row xl:items-center justify-between min-w-0 w-full'>
            <div className='w-full text-center md:text-left'>
              <h1 className='line-clamp-1 truncate text-lg font-semibold'>{order._id.toString()}</h1>
              <p className='text-muted text-nowrap '>
                {new Date(order.createdAt!).toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </p>
            </div>
            <div className='flex flex-col lg:flex-row w-full space-x-8 space-y-2  text-left justify-center items-center md:items-start lg:justify-start lg:items-baseline'>
              <p className='text-nowrap'>{order.orderItems.reduce((a, c) => a + c.quantity, 0)} items</p>
              <p className='text-xl font-bold font-plus-jakarta-sans'>${order.totalPrice}</p>
            </div>
          </section>

          <div className='flex flex-col xl:flex-row items-center gap-4 justify-end w-fit lg:w-full'>
            <div className='lg:flex lg:items-center lg:justify-center lg:w-full'>
              <ShippingStatusSelector
                order={order}
                setOrders={setOrders}
              />
            </div>

            <Link
              href={`/orders/${order._id}`}
              className='flex shrink gap-1 items-center px-4 py-2 rounded-2xl text-nowrap hover:text-muted hover:bg-muted/30'
            >
              View Details
              <FaChevronRight />
            </Link>
          </div>
        </div>
      ))}
    </section>
  )
}

export default OrderList
