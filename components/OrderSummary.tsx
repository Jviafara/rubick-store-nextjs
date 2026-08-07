import { useAppSelector } from '@/lib/hooks/redux.hooks'
import { ICartItem, IFullOrder, IOrderItems } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { RiSecurePaymentFill } from 'react-icons/ri'
interface OrderSummaryProps {
  order?: IFullOrder | null
}

const OrderSummary = ({ order }: OrderSummaryProps) => {
  const { cartItems } = useAppSelector(state => state.cart)

  const [subtotal, setSubtotal] = useState(order?.itemsPrice || 0)
  const [shipping, setShipping] = useState(order?.shippingPrice || 0)
  const [total, setTotal] = useState(order?.totalPrice || 0)
  const [items, setItems] = useState<IOrderItems[] | ICartItem[]>([])

  useEffect(() => {
    const getSubtotal = () => {
      if (order?._id) {
        setSubtotal(order.itemsPrice)
        setShipping(order.shippingPrice)
        setTotal(order.totalPrice)
        return
      }
      const subTotal = cartItems?.reduce((a, c) => a + c.quantity * c.price!, 0)
      setSubtotal(subTotal)
      setShipping(subTotal >= 100 ? 0 : subtotal * 0.15)
      setTotal(subTotal + (subTotal >= 100 ? 0 : subtotal * 0.15))
    }
    getSubtotal()
  }, [cartItems, total, subtotal, order])

  useEffect(() => {
    const setItemsFunc = () => {
      if (order) {
        setItems([...order.orderItems])
      } else {
        setItems([...cartItems])
      }
    }
    setItemsFunc()
  }, [order, cartItems])

  return (
    <div
      className={`w-full h-full ${shipping === 0 ? 'card-gradient-cyan-magenta' : 'card-gradient-emerald-cyan'}  px-4 py-8 flex flex-col space-y-4`}
    >
      <h1 className='text-xl font-semibold font-plus-jakarta-sans uppercase'>Order summary</h1>
      <div className='w-full flex flex-col gap-4'>
        {items.map(item => (
          <div
            className='w-full max-w-full flex items-center gap-4'
            key={item.slug}
          >
            <Link
              href={`/product/slug/${item.slug}`}
              className='w-fit shrink-0 bg-muted/30 rounded-2xl mg:rounded-l-2xl flex justify-center'
            >
              <div className='relative w-16 aspect-square  '>
                <Image
                  src={item.images![0]}
                  alt={'Image'}
                  fill
                  sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                  loading='eager'
                  className='object-contain z-0 rounded-2xl p-1'
                />
              </div>
            </Link>
            <section className='min-w-0 flex-1'>
              <h1 className='text-xl truncate'>{item.name}</h1>
              <div className='w-full flex gap-8 justify-end text-main font-plus-jakarta-sans'>
                <p>x{item.quantity}</p>
                <p className='shrink-0 whitespace-nowrap'>${(item.price || 0) * item.quantity}</p>
              </div>
            </section>
          </div>
        ))}
      </div>

      <div className='border-t border-muted/30 h-0 w-full' />

      <div className='flex justify-between items-center text-lg'>
        <h1 className='flex items-baseline gap-1'>
          Subtotal
          <span className='text-muted font-light text-sm'>({items?.reduce((a, c) => a + c.quantity, 0)} items)</span>:
        </h1>
        <p>${subtotal}</p>
      </div>
      <div className='flex justify-between items-center text-lg'>
        <h1>Shipping:</h1>
        {shipping === 0 ? (
          <p className='uppercase text-tertiary font-bold'>Free</p>
        ) : (
          <p className='uppercase'>${shipping}</p>
        )}
      </div>
      <div className='border-t border-muted/30 h-0 w-full' />
      <div className='flex justify-between items-center text-2xl font-bold'>
        <h1 className='flex items-baseline gap-1 uppercase font-semibold font-plus-jakarta-sans'>Total</h1>
        <p>${total}</p>
      </div>
      <div className='flex justify-center gap-1 items-center text-muted'>
        <RiSecurePaymentFill size={24} />
        <p className='text-muted'>Secure checkout</p>
      </div>
    </div>
  )
}

export default OrderSummary
