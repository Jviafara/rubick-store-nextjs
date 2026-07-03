'use client'

import ProductsCartTable from '@/components/ProductsCartTable'
import { useSession } from '@/lib/auth/auth-client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { clearCart } from '@/lib/redux/features/cartSlice'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

const Cart = () => {
  const { data: session } = useSession()

  const router = useRouter()

  const dispatch = useAppDispatch()
  const { cartItems } = useAppSelector(state => state.cart)

  const checkoutHandler = () => {
    if (session?.user) {
      router.push('/shipping-address')
    } else {
      router.push('/signin')
    }
  }

  const handleClearCart = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Clear Cart!',
    }).then(result => {
      if (result.isConfirmed) {
        dispatch(clearCart())
        Swal.fire('Cart Empty!', '', 'success')
      }
    })
  }

  return (
    <div className='flex justify-center p-4 '>
      <div className='w-[90vw] py-4'>
        <div className='flex flex-col lg:flex-row items-start  gap-8'>
          {cartItems?.length === 0 ? (
            <div className='w-full flex justify-center rounded-lg bg-cyan-100 p-6'>
              <p className='text-2xl text-center flex justify-center text-blue-900 gap-8'>
                Cart Is Empty.
                <Link
                  href='/products'
                  className='underline text-blue-700'
                >
                  Go Shopping
                </Link>
              </p>
            </div>
          ) : (
            <div className='w-full lg:w-[70%]'>
              <ProductsCartTable />
            </div>
          )}
          <div className='w-full lg:w-[30%] max-h-max flex flex-col gap-4 '>
            <div className='w-full max-h-max flex flex-col gap-4 py-4 px-3 lg:p-6 rounded-xl bg-gray-200  bg-opacity-50 backdrop-blur-2xl'>
              <div className='flex lg:flex-col xl:flex-row justify-between'>
                <h1 className='text-xl md:text-2xl lg:text-base xl:text-2xl font-bold'>
                  SubTotal ({cartItems?.reduce((a, c) => a + c.quantity, 0)} items) :
                </h1>
                <p className='text-2xl font-bold'>${cartItems?.reduce((a, c) => a + c.quantity * c.price!, 0)}</p>
              </div>
              {cartItems?.length === 0 ? (
                <button
                  onClick={checkoutHandler}
                  type='button'
                  disabled
                  className='rounded-lg borde bg-gray-300 p-2 w-full text-gray-500 font-bold text-lg'
                >
                  Checkout
                </button>
              ) : (
                <button
                  onClick={checkoutHandler}
                  type='button'
                  className='rounded-lg border hover:bg-blue-600 bg-yellow p-2 w-full text-white font-bold text-lg hover:cursor-pointer'
                >
                  Checkout
                </button>
              )}
            </div>
            {cartItems.length > 0 && (
              <button
                onClick={handleClearCart}
                type='button'
                className='rounded-lg border bg-red-500 p-2 w-full text-white font-bold text-lg uppercase hover:cursor-pointer'
              >
                Clear Cart!
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
