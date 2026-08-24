import { AddressApi } from '@/lib/modules/addressApiClient'
import { IShippingAddress } from '@/lib/types'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import OrderSummary from './OrderSummary'
import PaymentButton from './PaymentButton'

const PaymentStep = () => {
  const [address, setAddress] = useState<IShippingAddress | null>(null)

  useEffect(() => {
    const getShippingAddres = async () => {
      const { res, error } = await AddressApi.default()

      if (res.status || error) {
        toast.error(res.message)
      }

      setAddress(res)
    }
    getShippingAddres()
  }, [])

  return (
    <div className='w-full xl:max-w-[70%] flex flex-col lg:grid lg:grid-cols-2 gap-4 text-main '>
      <div className='w-full h-fit col-span-1'>
        <OrderSummary />
      </div>
      <div className='w-full h-fit col-span-1 flex flex-col gap-4'>
        <section className='w-full flex flex-col gap-2 border border-muted rounded-2xl bg-surface/70 px-4 py-4 '>
          <div className='w-full flex justify-between items-center'>
            <h1 className='font-plus-jakarta-sans'>
              Delivered to <span className='font-semibold uppercase'>{address?.name}</span>
            </h1>
          </div>
          <div className='flex flex-col gap-0'>
            <p>
              {address?.address} - {address?.phone}
            </p>
            <p>
              {address?.city} - {address?.country}
            </p>
            <p>{address?.postalCode}</p>
          </div>
        </section>
        <section className='w-full flex flex-col gap-2 border border-muted rounded-2xl bg-surface/70 px-4 py-4 '>
          <PaymentButton />
        </section>
      </div>
    </div>
  )
}

export default PaymentStep
