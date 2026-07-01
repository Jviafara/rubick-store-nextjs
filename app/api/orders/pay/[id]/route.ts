import { auth } from '@/lib/auth/auth'
import Order from '@/lib/models/order'
import responseHandler from '@/lib/responseHandler'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_S_KEY || ' ')

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user) {
      return responseHandler.unauthorize()
    }

    const order = await Order.findById(id)
    if (!order) return responseHandler.notFound()

    const body = await req.json()

    const charge = await stripe.charges.create({
      source: body.token.id,
      amount: body.amount,
      currency: 'usd',
    })

    order.isPaid = true
    order.paymentId = charge.id
    order.paidAt = Date.now()
    await order.save()

    responseHandler.ok(order)
  } catch (e) {
    console.error(e)
    responseHandler.error()
  }
}
