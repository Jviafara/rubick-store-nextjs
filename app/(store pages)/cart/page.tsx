'use client'

import { useSession } from '@/lib/auth/auth-client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { clearCart } from '@/lib/redux/features/cartSlice'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { FaTrashAlt } from 'react-icons/fa'
import { FaArrowRightLong } from 'react-icons/fa6'
import { RiSecurePaymentFill } from 'react-icons/ri'
import ProductCartCard from '@/components/ProductCartCard'
import { setModalService, toogleModalService } from '@/lib/redux/features/modalSlice'
import { ModalPositions } from '@/lib/constants'
import { toast } from 'react-toastify'
import EmptyBanner from '@/components/EmptyBanner'
import { MdRemoveShoppingCart } from 'react-icons/md'

const Cart = () => {
  const { data: session } = useSession()

  const router = useRouter()

  const dispatch = useAppDispatch()
  const { cartItems } = useAppSelector(state => state.cart)
  const [subtotal, setSubtotal] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [total, setTotal] = useState(0)

  const checkoutHandler = () => {
    if (session?.user) {
      router.push('/checkout?step=1')
    } else {
      router.push('/sign-in')
    }
  }

  useEffect(() => {
    const getSubtotal = () => {
      if (cartItems.length <= 0) return
      const subTotal = cartItems?.reduce((a, c) => a + c.quantity * c.price!, 0)
      setSubtotal(subTotal)
      setShipping(subTotal >= 100 ? 0 : subtotal * 0.15)
      setTotal(subTotal + (subTotal >= 100 ? 0 : subtotal * 0.15))
    }
    getSubtotal()
  }, [cartItems, total, subtotal])

  const handleClearCart = async () => {
    dispatch(
      setModalService({
        modalOpen: true,
        header: 'Clear Cart!',
        subTitle: 'This action can not be reverted.',
        children: <h1 className='text-xl font-bold font-plus-jakarta-sans '>Are you sure you want to remove all items?</h1>,
        position: ModalPositions.center,
        confirmButton: {
          label: 'Clear',
          color: 'secondary',
          action: () => {
            dispatch(toogleModalService(false))
            toast.success('Cart cleared succesfully')
            dispatch(clearCart())
          },
        },
        cancelButton: {
          label: 'cancel',
          color: 'primary',
          action: () => {
            dispatch(toogleModalService(false))
          },
        },
      }),
    )
  }

  if (cartItems.length <= 0) {
    return (
      <EmptyBanner
        header='YOUR CART IS EMPTY'
        Icon={MdRemoveShoppingCart}
      />
    )
  }

  return (
    <main className='w-[95vw] md:max-w-[90vw] lg:w-[80vw] min-h-[calc(100vh-76px)] mx-auto gap-4 lg:gap-0  flex flex-col px-4 py-16 items-center text-main'>
      {/* Heading */}
      <section className='w-full flex flex-col gap-4'>
        <h1 className='text-4xl font-plus-jakarta-sans font-bold uppercase'>Your cart</h1>
        {cartItems.length > 0 && (
          <div className='w-fit flex items-center gap-4 leading-none lg:-mb-8 z-50'>
            <p className='lg:text-lg'>{cartItems.length} items in cart</p>
            <p className='text-2xl text-muted font-extrabold'>/</p>

            <button
              onClick={handleClearCart}
              type='button'
              className='rounded-2xl w-fit text-main lg:text-lg uppercase hover:text-secondary  hover:cursor-pointer flex gap-1 items-center'
            >
              <FaTrashAlt size={20} />
              Clear
            </button>
          </div>
        )}
      </section>
      {/* Main Content */}
      <section className='w-full flex flex-col lg:grid lg:grid-cols-6 gap-4'>
        {/* Products list */}
        <div className='w-full col-span-4 flex flex-col space-y-4 rounded-2xl lg:py-12'>
          {cartItems.map(item => (
            <ProductCartCard
              key={item._id.toString()}
              cartItem={item}
            />
          ))}
        </div>
        {/* Order summary */}
        <div className={`w-full h-fit col-span-2 ${shipping === 0 ? 'card-gradient-cyan-magenta' : 'card-gradient-emerald-cyan'}  px-4 py-8 flex flex-col space-y-4`}>
          <div>
            <h1 className='text-xl font-light font-plus-jakarta-sans uppercase'>Order summary</h1>
            <p className='text-muted text-sm'>{cartItems.length} products</p>
          </div>
          <div className='flex justify-between items-center text-lg'>
            <h1 className='flex items-baseline gap-1'>
              Subtotal
              <span className='text-muted font-light text-sm'>({cartItems?.reduce((a, c) => a + c.quantity, 0)} items)</span>:
            </h1>
            <p>${subtotal}</p>
          </div>
          <div className='flex justify-between items-center text-lg'>
            <h1>Shipping:</h1>
            {shipping === 0 ? <p className='uppercase text-tertiary font-bold'>Free</p> : <p className='uppercase'>{shipping}</p>}
          </div>
          <div className='border-t border-muted/30 h-0 w-full' />
          <div className='flex justify-between items-center text-2xl font-bold'>
            <h1 className='flex items-baseline gap-1'>Total:</h1>
            <p>${total}</p>
          </div>
          <div className='flex justify-between items-center text-2xl font-bold'>
            <button
              onClick={checkoutHandler}
              type='button'
              className='gradient-button text-base uppercase font-plus-jakarta-sans font-bold'
            >
              proceed to Checkout <FaArrowRightLong />
            </button>
          </div>
          <div className='flex justify-center gap-1 items-center text-muted'>
            <RiSecurePaymentFill size={24} />
            <p className='text-muted'>Secure checkout</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Cart
