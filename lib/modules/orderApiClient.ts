import { BASE_URL, orderEndpoints } from '../constants'
import { CreateOrderProps, OrderPaymentProps, OrderUpdateProps } from '../types'

export const OrdersApi = {
  create: async ({ shippingAddress, itemsPrice, shippingPrice, totalPrice, orderItems }: CreateOrderProps) => {
    const body = {
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
      orderItems,
    }
    try {
      const response = await fetch(`${BASE_URL}/api/${orderEndpoints.create}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      console.error(error)
      return { error }
    }
  },
  getList: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/${orderEndpoints.list}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      console.error(error)
      return { error }
    }
  },
  orderDetail: async ({ orderId }: { orderId: string }) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${orderEndpoints.details(orderId)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      console.error(error)
      return { error }
    }
  },
  getListUser: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/${orderEndpoints.userList}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      console.error(error)
      return { error }
    }
  },
  orderPayment: async ({ orderId, amount, type, paymentId }: OrderPaymentProps) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${orderEndpoints.orderPayment(orderId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount,
          type,
          paymentId,
        }),
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      console.error(error)
      return { error }
    }
  },
  update: async ({ orderId, isPaid, shippingStatus }: OrderUpdateProps) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${orderEndpoints.update(orderId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isPaid,
          shippingStatus,
        }),
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      console.error(error)
      return { error }
    }
  },
}
