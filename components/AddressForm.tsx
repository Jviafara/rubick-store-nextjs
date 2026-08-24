import { authClient, useSession } from '@/lib/auth/auth-client'
import { colorClasses } from '@/lib/constants'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { AddressApi } from '@/lib/modules/addressApiClient'
import { userApi } from '@/lib/modules/userApiClient'
import { toogleModalService } from '@/lib/redux/features/modalSlice'
import { FullUser, IShippingAddress } from '@/lib/types'
import { useEffect, useState } from 'react'
import { BsSuitDiamond, BsSuitDiamondFill } from 'react-icons/bs'
import { toast } from 'react-toastify'

const AddressForm = ({ addressId, onSuccess }: { addressId?: string; onSuccess: () => void }) => {
  const { refetch } = authClient.useSession()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [isDefault, setIsDefault] = useState(false)
  const { data: session } = useSession()

  const dispatch = useAppDispatch()

  const confirmClasses = colorClasses['primary' as keyof typeof colorClasses]

  const cancelClasses = colorClasses['secondary' as keyof typeof colorClasses]

  const hydrateForm = (data: IShippingAddress) => {
    if (data) {
      setName(data.name || '')
      setAddress(data.address || '')
      setPhone(data.phone || '')
      setCity(data.city || '')
      setPostalCode(data.postalCode || '')
      setCountry(data.country || '')
    }
  }

  useEffect(() => {
    const getShippingAddres = async () => {
      if (addressId) {
        const { res, error } = await AddressApi.byId(addressId)
        if (res.status || error) {
          if (res.status === 404) {
            return
          }
          toast.error(res.message)
          return
        }
        if (res._id === (session?.user as FullUser).defaultAddress) setIsDefault(true)
        hydrateForm(res)
      }
    }
    getShippingAddres()
  }, [addressId, session])

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const body = {
      name,
      address,
      city,
      postalCode,
      phone,
      country,
    }

    if (addressId) {
      const { res, error } = await AddressApi.update({ ...body, id: addressId })
      if (res.status || error) toast.error(res.message)

      if (isDefault) {
        const { res, error } = await userApi.update({ id: session?.user.id || '', defaultAddress: addressId })
        if (res.status || error) toast.error(res.message)
      }

      onSuccess()
      await refetch()
      dispatch(toogleModalService(false))
    } else {
      const { res, error } = await AddressApi.create({ ...body, isDefault })

      if (res.status || error) toast.error(res.message)

      onSuccess()
      await refetch()
      dispatch(toogleModalService(false))
    }
    dispatch(toogleModalService(false))
  }

  return (
    <div className='flex flex-col justify-center items-baseline gap-4 w-full'>
      <form
        onSubmit={handleSubmit}
        className='w-full flex flex-col items-center gap-4 mb-4 text-main'
      >
        <section className='flex flex-col lg:flex-row gap-4 w-full'>
          <div className='flex-2 flex w-full flex-col md:text-lg  gap-1'>
            <label htmlFor='name'>Full Name</label>
            <input
              type='text'
              name='name'
              id='name'
              value={name}
              onChange={e => setName(e.target.value)}
              className='w-full h-10 rounded-2xl md:text-lg py-1 px-4 border border-muted focus:outline-primary focus:border-none focus:outline-1'
            />
          </div>
          <div className='flex-1 flex w-full flex-col md:text-lg  gap-1'>
            <label htmlFor='phone'>Phone Number</label>
            <input
              type='text'
              name='phone'
              id='phone'
              value={phone}
              onChange={e => setPhone(e.target.value)}
              className='w-full h-10 rounded-2xl md:text-lg py-1 px-4 border border-muted focus:outline-primary focus:border-none focus:outline-1'
            />
          </div>
        </section>

        <div className='flex w-full flex-col md:text-lg  gap-1'>
          <label htmlFor='address'>Address</label>
          <input
            type='text'
            name='address'
            id='address'
            value={address}
            onChange={e => setAddress(e.target.value)}
            className='w-full h-10 rounded-2xl md:text-lg py-1 px-4 border border-muted focus:outline-primary focus:border-none focus:outline-1'
          />
        </div>
        <section className='flex flex-col md:flex-row gap-4 w-full'>
          <div className='flex w-full flex-col md:text-lg  gap-1'>
            <label htmlFor='city'>City</label>
            <input
              type='text'
              name='city'
              id='city'
              value={city}
              onChange={e => setCity(e.target.value)}
              className='w-full h-10 rounded-2xl md:text-lg py-1 px-4 border border-muted focus:outline-primary focus:border-none focus:outline-1'
            />
          </div>
          <div className='flex w-full flex-col md:text-lg  gap-1'>
            <label htmlFor='country'>Country</label>
            <input
              type='text'
              name='country'
              id='country'
              value={country}
              onChange={e => setCountry(e.target.value)}
              className='w-full h-10 rounded-2xl md:text-lg py-1 px-4 border border-muted focus:outline-primary focus:border-none focus:outline-1'
            />
          </div>
        </section>
        <section className='flex flex-col md:flex-row justify-between gap-4 items-center w-full'>
          <div className='flex w-full flex-col text-lg self-start  gap-1'>
            <label htmlFor='postalCode'>Postal Code</label>
            <input
              type='text'
              name='postalCode'
              id='postalCode'
              value={postalCode}
              onChange={e => setPostalCode(e.target.value)}
              className='w-full h-10 rounded-2xl md:text-lg py-1 px-4 border border-muted focus:outline-primary focus:border-none focus:outline-1'
            />
          </div>
          <div
            onClick={() => setIsDefault(prev => !prev)}
            className='w-full flex gap-4 items-center md:justify-center cursor-pointer py-4'
          >
            {isDefault ? (
              <BsSuitDiamondFill
                className='text-primary'
                size={24}
              />
            ) : (
              <BsSuitDiamond size={24} />
            )}
            <p className='text-main'> Default Address</p>
          </div>
        </section>
        <div className='w-full flex justify-between md:justify-evenly'>
          <div
            onClick={() => dispatch(toogleModalService(false))}
            className={`w-fit rounded-2xl border px-8 py-1 font-bold uppercase transition-all duration-500 hover:scale-105 ${cancelClasses.border} ${cancelClasses.hoverBg}`}
          >
            Cancel
          </div>
          <button
            type='submit'
            className={`w-fit rounded-2xl border px-8 py-1 font-bold uppercase transition-all duration-500 hover:scale-105 ${confirmClasses.bg} ${confirmClasses.hoverBg} ${confirmClasses.border}`}
          >
            Save
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddressForm
