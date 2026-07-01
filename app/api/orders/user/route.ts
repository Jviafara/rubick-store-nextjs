import { auth } from '@/lib/auth/auth'
import Order from '@/lib/models/order'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
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
    const orders = await Order.find({ user: session.user.id })
    console.log(orders)

    if (!orders) return responseHandler.notFound()
    return responseHandler.ok(orders)
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}
