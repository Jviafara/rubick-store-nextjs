'use client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { clearCart } from '@/lib/redux/features/cartSlice'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IOrderItems } from '@/lib/types'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ProductsCartTable from './ProductsCartTable'
import Link from 'next/link'
import { useSession } from '@/lib/auth/auth-client'

const PlaceOrderForm = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  const { cartItems, shippingAddress } = useAppSelector(state => state.cart)

  const [itemsPrice, setItemsPrice] = useState(0)
  const [shippingPrice, setShippingPrice] = useState(0)
  const [totalPrice, setTotalPrice] = useState(0)

  const round2 = (num: number) => Math.round(num * 100 + Number.EPSILON) / 100

  useEffect(() => {
    const setPrices = () => {
      setItemsPrice(round2(cartItems.reduce((a, c) => a + c.quantity * c.price!, 0)))
      setShippingPrice(itemsPrice > 100 ? round2(0) : round2(10))
      setTotalPrice(itemsPrice + shippingPrice)
    }
    setPrices()
  }, [cartItems, shippingPrice, totalPrice, itemsPrice])

  const placeOrderHandler = async () => {
    dispatch(setGlobalLoading(true))
    const { res, error } = await OrdersApi.create({
      shippingAddress,
      itemsPrice,
      totalPrice,
      shippingPrice,
      paymentId: '1',
      orderItems: cartItems as IOrderItems[],
    })
    dispatch(setGlobalLoading(false))
    console.log('res', res)

    if (res) {
      dispatch(clearCart())
      router.push(`/order/${res.id}`)
    }
    if (error) toast.error(res.message)
  }

  return (
    <div className='max-w-[95vw] xl:max-w-[85vw]'>
      <div className='flex flex-col lg:flex-row gap-4'>
        <section className='w-full lg:w-[70%] flex flex-col gap-4'>
          <div className='flex flex-col gap-3 p-6  border border-yellow rounded-lg shadow'>
            <h1 className='text-2xl font-medium '>Shipping</h1>
            <div>
              <p className='text-lg'>
                <strong>Name:</strong> {session?.user?.name}
              </p>
              <p>
                <strong>City:</strong> {shippingAddress?.city}
              </p>
              <p>
                <strong>Address:</strong> {shippingAddress?.address}
              </p>
            </div>
            <Link
              href={'/shipping-address'}
              className='underline text-blue-600 text-lg mt-2 '
            >
              Edit
            </Link>
          </div>
          <div className='flex flex-col gap-3 p-1 md:p-6 border border-yellow rounded-lg shadow'>
            <h1 className='text-2xl font-medium '>Items</h1>
            <div className='w-full overflow-hidden'>
              {cartItems.length > 0 ? (
                <div>
                  <ProductsCartTable />
                </div>
              ) : (
                <div className='w-full rounded-lg h-fit bg-cyan-100 p-6'>
                  <p className='text-2xl text-cente line text-blue-900'>
                    Cart Is Empty.
                    <Link
                      href='/products'
                      className='underline text-blue-700'
                    >
                      Go Shopping
                    </Link>
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className='w-full lg:w-[30%] xl:mx-4 xl:px-6'>
          <div className='flex flex-col gap-2 p-6 border border-yellow rounded-lg'>
            <h1 className='text-2xl font-medium mb-2'>Order Summary</h1>
            <div className='flex justify-between px-4 lg:p-0 text-2xl'>
              <div className='w-2/3'>
                <p>Items</p>
              </div>
              <p>${itemsPrice}</p>
            </div>
            <hr className='border border-yellow' />
            <div className='flex justify-between items-center px-4 lg:p-0 text-2xl'>
              <div className='w-2/3'>
                <p>Shipping</p>
              </div>
              <p>${shippingPrice}</p>
            </div>
            <hr className='border border-yellow' />
            <div className='flex justify-between px-4 lg:p-0 text-2xl font-bold'>
              <div className='w-2/3'>
                <p>Order Total</p>
              </div>
              <p>${totalPrice}</p>
            </div>
            <hr className='border border-yellow' />
            {cartItems.length > 0 && (
              <div className='flex flex-col gap-3'>
                <button
                  onClick={placeOrderHandler}
                  type='button'
                  className='rounded-lg border hover:bg-blue-600 bg-yellow p-2 w-full text-white font-bold text-lg'
                >
                  Place Order
                </button>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}

export default PlaceOrderForm
