import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { IShippingAddress } from '@/lib/types'
import { setShippingAddress } from '@/lib/redux/features/cartSlice'

const ShippingAddressForm = ({ shippingAddress }: { shippingAddress: IShippingAddress }) => {
  const router = useRouter()
  const dispatch = useAppDispatch()

  const [name, setName] = useState(shippingAddress?.name || '')
  const [address, setAddress] = useState(shippingAddress?.address || '')
  const [city, setCity] = useState(shippingAddress?.city || '')
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '')
  const [country, setCountry] = useState(shippingAddress?.country || '')

  // Sync form state when shippingAddress prop changes (e.g., after hydration)
  useEffect(() => {
    const hydrateForm = () => {
      if (shippingAddress) {
        setName(shippingAddress.name || '')
        setAddress(shippingAddress.address || '')
        setCity(shippingAddress.city || '')
        setPostalCode(shippingAddress.postalCode || '')
        setCountry(shippingAddress.country || '')
      }
    }
    hydrateForm()
  }, [shippingAddress])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const userAddress = { name, address, city, postalCode, country }
    dispatch(setShippingAddress(userAddress))
    router.push('/place-order')
  }

  return (
    <div className='flex justify-center w-full '>
      <div className='flex flex-col items-center w-[90vw] md:w-[66vw] lg:w-[33vw]'>
        <h2 className='text-center text-3xl '>Shipping Address</h2>
        <form
          onSubmit={handleSubmit}
          className='w-full flex flex-col items-center gap-2 mb-4'
        >
          <div className='flex w-full flex-col text-lg xl:text-xl gap-1'>
            <label htmlFor='name'>Full Name</label>
            <input
              type='text'
              name='name'
              id='name'
              value={name}
              onChange={e => setName(e.target.value)}
              className='w-full h-8 rounded-lg text-lg py-1 px-4 border border-gray-50 focus:outline-blue-500 focus:border-none focus:outline-1'
            />
          </div>
          <div className='flex w-full flex-col text-lg xl:text-xl gap-1'>
            <label htmlFor='address'>Address</label>
            <input
              type='text'
              name='address'
              id='address'
              value={address}
              onChange={e => setAddress(e.target.value)}
              className='w-full h-8 rounded-lg text-lg py-1 px-4 border border-gray-50 focus:outline-blue-500 focus:border-none focus:outline-1'
            />
          </div>
          <div className='flex w-full flex-col text-lg xl:text-xl gap-1'>
            <label htmlFor='city'>City</label>
            <input
              type='text'
              name='city'
              id='city'
              value={city}
              onChange={e => setCity(e.target.value)}
              className='w-full h-8 rounded-lg text-lg py-1 px-4 border border-gray-50 focus:outline-blue-500 focus:border-none focus:outline-1'
            />
          </div>
          <div className='flex w-full flex-col text-lg xl:text-xl gap-1'>
            <label htmlFor='postalCode'>Postal Code</label>
            <input
              type='text'
              name='postalCode'
              id='postalCode'
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              className='w-full h-8 rounded-lg text-lg py-1 px-4 border border-gray-50 focus:outline-blue-500 focus:border-none focus:outline-1'
            />
          </div>
          <div className='flex w-full flex-col text-lg xl:text-xl gap-1'>
            <label htmlFor='country'>Country</label>
            <input
              type='text'
              name='country'
              id='country'
              value={country}
              onChange={e => setCountry(e.target.value)}
              className='w-full h-8 rounded-lg text-lg py-1 px-4 border border-gray-50 focus:outline-blue-500 focus:border-none focus:outline-1'
            />
          </div>
          <button
            type='submit'
            className='rounded-lg w-1/2 border hover:bg-blue-500 bg-yellow py-2 px-4
                        font-medium font-roboto uppercase mt-4 text-white'
          >
            Countinue
          </button>
        </form>
      </div>
    </div>
  )
}

export default ShippingAddressForm
