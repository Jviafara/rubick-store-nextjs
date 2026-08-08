import { Stripe, loadStripe } from '@stripe/stripe-js'
import { FullUser, IOrder, IProduct } from './types'
import { ModalPositions } from './constants'

export const getDate = (product: IProduct | IOrder | FullUser) => {
  const date = new Date(product.createdAt || '')
  return date
}

let stripePromise: Promise<Stripe | null>
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

const getModalPositionClass = (position: ModalPositions) => {
  switch (position) {
    case 'top_center':
      return 'inset'

    default:
      break
  }
}
