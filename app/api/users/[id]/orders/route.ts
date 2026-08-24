import { auth } from '@/lib/auth/auth'
import Order from '@/lib/models/order'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user || session?.user.role !== 'admin') {
      return responseHandler.unauthorize()
    }

    await connectDB()

    const user = await User.findById(id)
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 })

    if (!user) return responseHandler.notFound()

    return responseHandler.ok({ user, orders })
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}
