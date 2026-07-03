import { auth } from '@/lib/auth/auth'
import Order from '@/lib/models/order'
import responseHandler from '@/lib/responseHandler'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '')

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

    if (body.type === 'payment_intent') {
      const charge = await stripe.paymentIntents.create({
        amount: body.amount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
      })

      order.paymentId = charge.id
      await order.save()
      return responseHandler.ok({ order, clientSecret: charge.client_secret })
    }

    order.isPaid = true
    order.paidAt = Date.now()
    await order.save()

    return responseHandler.ok({ order })
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}
