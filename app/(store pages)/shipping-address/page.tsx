'use client'
import ShippingAddressForm from '@/components/ShippingAddressForm'
import { useSession } from '@/lib/auth/auth-client'
import { useAppSelector } from '@/lib/hooks/redux.hooks'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

const ShippingAddress = () => {
  const router = useRouter()
  const { data: session } = useSession()
  useEffect(() => {
    if (!session?.user) router.push('/sign-in')
  })
  const { shippingAddress } = useAppSelector(state => state.cart)
  return (
    <div className='flex flex-col gap-4'>
      <ShippingAddressForm shippingAddress={shippingAddress} />
    </div>
  )
}

export default ShippingAddress
