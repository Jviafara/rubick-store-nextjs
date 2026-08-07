import { auth } from '@/lib/auth/auth'
import Order from '@/lib/models/order'
import Product from '@/lib/models/product'
import responseHandler from '@/lib/responseHandler'
import { IOrderItems } from '@/lib/types'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing from environment variables.')
}

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

    const body = await req.json()

    if (body.type === 'payment_intent') {
      const charge = await stripe.paymentIntents.create({
        amount: body.amount,
        currency: 'usd',
        automatic_payment_methods: { enabled: true },
      })

      return responseHandler.ok({ clientSecret: charge.client_secret })
    }
    if (body.type === 'payment_confirmation') {
      const order = await Order.findById(id)
      if (!order) return responseHandler.notFound()

      order.orderItems.forEach(async (prod: IOrderItems) => {
        const product = await Product.findById(prod._id)
        product.countInStock -= prod.quantity
        product.totalSold += prod.quantity
        product.save()
      })

      order.paymentId = body.paymentId
      order.isPaid = true
      order.paidAt = Date.now()
      await order.save()

      return responseHandler.ok({ order })
    }
    return responseHandler.ok({ ok: 'OK' })
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}
