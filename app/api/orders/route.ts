import { auth } from '@/lib/auth/auth'
import Address from '@/lib/models/address'
import Order from '@/lib/models/order'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { IProduct } from '@/lib/types'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user) {
      return responseHandler.unauthorize()
    }

    await connectDB()
    const orders = await Order.find()

    if (!orders) return responseHandler.notFound()
    return responseHandler.ok(orders)
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user) {
      return responseHandler.unauthorize()
    }

    const body = await req.json()
    const address = await Address.findById(body.shippingAddress)

    if (!address) {
      return responseHandler.badRequest('Address not found')
    }
    await connectDB()
    const order = await Order.create({
      orderItems: body.orderItems.map((product: IProduct) => ({
        ...product,
        product: product._id,
      })),
      shippingAddress: {
        ...address,
      },
      paymentId: body.paymentId,
      itemsPrice: body.itemsPrice,
      shippingPrice: body.shippingPrice,
      totalPrice: body.totalPrice,
      user: session.user.id,
    })

    return responseHandler.created(order)
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}
