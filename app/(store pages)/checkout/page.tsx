'use client'
import CheckoutSteps from '@/components/CheckoutSteps'
import OrderReview from '@/components/OrderReview'
import PaymentStep from '@/components/PaymentStep'
import ShippingStep from '@/components/ShippingStep'
import { AnimatePresence, motion } from 'motion/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

const CheckoutPageContent = () => {
  const searchParams = useSearchParams()
  const step: string = searchParams.get('step') || '1'

  return (
    <main className='w-[95vw] md:max-w-[90vw] lg:w-[80vw] min-h-[calc(100vh-76px)] mx-auto lg:gap-0  flex flex-col px-4 py-4 space-y-12 items-center text-main'>
      <header className='flex flex-col gap-4 w-full'>
        <h1 className='text-center uppercase font-plus-jakarta-sans font-semibold text-3xl '>Checkout</h1>

        {/* Steps */}
        <CheckoutSteps />
      </header>

      {/* Main Content */}

      <AnimatePresence
        mode='wait'
        initial={false}
      >
        {step === '1' && (
          <motion.div
            key='shipping'
            className='w-full flex justify-center'
            initial={{ opacity: 0, x: 300, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -300, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <ShippingStep />
          </motion.div>
        )}
        {step === '2' && (
          <motion.div
            key='payment'
            className='w-full  flex justify-center'
            initial={{ opacity: 0, x: 300, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -300, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <PaymentStep />
          </motion.div>
        )}
        {step === '3' && (
          <motion.div
            key='review'
            className='w-full  flex justify-center'
            initial={{ opacity: 0, x: 300, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: -300, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <OrderReview />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}

const CheckoutPage = () => {
  return (
    <Suspense fallback={null}>
      <CheckoutPageContent />
    </Suspense>
  )
}

export default CheckoutPage
