import { auth } from '@/lib/auth/auth'
import Order from '@/lib/models/order'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user) {
      return responseHandler.unauthorize()
    }

    await connectDB()
    const order = await Order.findById(id)

    if (!order) return responseHandler.notFound()
    return responseHandler.ok(order)
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user) {
      return responseHandler.unauthorize()
    }

    await connectDB()

    const isOrder = await Order.findById(id)
    if (!isOrder) return responseHandler.notFound()

    await Order.findByIdAndDelete(id)

    return responseHandler.ok({ _id: id })
  } catch (err) {
    console.error(err)
    return responseHandler.error()
  }
}
