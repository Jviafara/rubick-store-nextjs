'use client'

import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import { useEffect, useState } from 'react'
import StripeCheckout from './StripeCheckout'
import { useAppSelector } from '@/lib/hooks/redux.hooks'
import { AddressApi } from '@/lib/modules/addressApiClient'
import { toast } from 'react-toastify'
import { IOrderItems, IShippingAddress } from '@/lib/types'
import { OrdersApi } from '@/lib/modules/orderApiClient'

const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

const PaymentButton = () => {
  const { cartItems } = useAppSelector(state => state.cart)
  const [address, setAddress] = useState<IShippingAddress>()

  const [subtotal, setSubtotal] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [total, setTotal] = useState(1)

  useEffect(() => {
    const getShippingAddres = async () => {
      const { res, error } = await AddressApi.default()

      if (res.status || error) {
        toast.error(res.message)
      }

      setAddress(res)
    }
    getShippingAddres()
  }, [])

  useEffect(() => {
    const getSubtotal = () => {
      if (cartItems.length <= 0) return
      const subTotal = cartItems?.reduce((a, c) => a + c.quantity * c.price!, 0)
      setSubtotal(subTotal)
      setShipping(subTotal >= 100 ? 0 : subTotal * 0.15)
      setTotal(subTotal + (subTotal >= 100 ? 0 : subTotal * 0.15))
    }
    getSubtotal()
  }, [cartItems, total])

  const createOrder = async () => {
    const { res, error } = await OrdersApi.create({
      shippingAddress: address?._id.toString() || '',
      itemsPrice: subtotal,
      shippingPrice: shipping,
      totalPrice: total,
      orderItems: cartItems as IOrderItems[],
    })

    if (res.status || error) {
      toast.error(res.message)
      return
    }
    return res
  }

  return (
    <div>
      <Elements
        stripe={stripe}
        options={{ mode: 'payment', amount: total * 100, currency: 'usd' }}
      >
        <StripeCheckout
          amount={total}
          createOrder={createOrder}
        />
      </Elements>
    </div>
  )
}

export default PaymentButton
