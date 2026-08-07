'use client'
import ShippingAddressForm from './ShippingAddressForm'
import OrderSummary from './OrderSummary'

const ShippingStep = () => {
  return (
    <div className='w-full xl:max-w-[70%] flex flex-col lg:grid lg:grid-cols-3 gap-4'>
      {/* Left content */}
      <div className='w-full h-fit col-span-2 border border-muted rounded-2xl bg-surface/70 px-8 py-8'>
        <ShippingAddressForm />
      </div>

      {/* Right content */}
      <div className='w-full h-fit col-span-1'>
      <OrderSummary />
      </div>
    </div>
  )
}

export default ShippingStep
