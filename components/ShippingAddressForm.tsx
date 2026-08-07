import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { IShippingAddress } from '@/lib/types'
import { AddressApi } from '@/lib/modules/addressApiClient'
import { toast } from 'react-toastify'
import { FaArrowRightLong } from 'react-icons/fa6'
import { LuSave } from 'react-icons/lu'
import { FaEdit } from 'react-icons/fa'
import { authClient } from '@/lib/auth/auth-client'

const ShippingAddressForm = () => {
  const { refetch } = authClient.useSession()
  const router = useRouter()
  const [edit, setEdit] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [postalCode, setPostalCode] = useState('')
  const [country, setCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [addressId, setAddressId] = useState('')

  const hydrateForm = (data: IShippingAddress) => {
    if (data) {
      setName(data.name || '')
      setAddress(data.address || '')
      setPhone(data.phone || '')
      setCity(data.city || '')
      setPostalCode(data.postalCode || '')
      setCountry(data.country || '')
      setAddressId(data._id.toString() || '')
    }
  }
  // Sync form state when shippingAddress prop changes (e.g., after hydration)
  useEffect(() => {
    const getShippingAddres = async () => {
      const { res, error } = await AddressApi.default()
      if (res.status || error) {
        if (res.status === 404) {
          setEdit(true)
          return
        }
        toast.error(res.message)
        setEdit(true)
        return
      }

      hydrateForm(res)
    }
    getShippingAddres()
  }, [])

  const createAddress = async () => {
    const body = {
      name,
      address,
      city,
      postalCode,
      phone,
      country,
      id: addressId,
    }
    const { res, error } = await AddressApi.create({ ...body })

    if (res.status || error) toast.error(res.message)
    hydrateForm(res)
    await refetch()
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!addressId) {
      await createAddress()
      router.push('/checkout?step=2')
      return
    }
    if (edit && addressId) {
      await handleSave()
      router.push('/checkout?step=2')
    }
    router.push('/checkout?step=2')
    return
  }

  const handleSave = async () => {
    const body = {
      name,
      address,
      city,
      postalCode,
      phone,
      country,
      id: addressId,
    }
    if (!addressId) {
      createAddress()
      setEdit(!edit)
      return
    }
    const { res, error } = await AddressApi.update({ ...body })
    if (res.status || error) toast.error(res.message)

    setEdit(!edit)
  }

  return (
    <div className='flex flex-col justify-center items-baseline gap-4 w-full '>
      <div className='relative w-full'>
        <h2 className='text-left! line-clamp-2 max-w-[60%] text-lg md:text-xl uppercase'>Shipping Information</h2>
        {/* Edit Button */}
        <div className='absolute top-1/2 right-0 -translate-y-1/2'>
          {edit ? (
            <button
              onClick={handleSave}
              className='hover:text-primary flex gap-2 items-center'
            >
              <LuSave size={20} /> <p className='text-main'>Save</p>
            </button>
          ) : (
            <button
              onClick={() => setEdit(!edit)}
              className='hover:text-primary flex gap-2 items-center'
            >
              <FaEdit size={20} /> <p className='text-main'>Edit</p>
            </button>
          )}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className='w-full flex flex-col items-center gap-4 mb-4 text-main'
      >
        <section className='flex flex-col md:flex-row gap-4 w-full'>
          <div className='flex w-full flex-col md:text-lg  gap-1'>
            <label htmlFor='name'>Full Name</label>
            <input
              type='text'
              name='name'
              id='name'
              value={name}
              disabled={!edit}
              onChange={e => setName(e.target.value)}
              className='w-full h-10 rounded-2xl md:text-lg py-1 px-4 border border-muted focus:outline-primary focus:border-none focus:outline-1'
            />
          </div>
          <div className='flex w-full flex-col md:text-lg  gap-1'>
            <label htmlFor='phone'>Phone Number</label>
            <input
              type='text'
              name='phone'
              id='phone'
              value={phone}
              disabled={!edit}
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
            disabled={!edit}
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
              disabled={!edit}
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
              disabled={!edit}
              onChange={e => setCountry(e.target.value)}
              className='w-full h-10 rounded-2xl md:text-lg py-1 px-4 border border-muted focus:outline-primary focus:border-none focus:outline-1'
            />
          </div>
        </section>
        <div className='flex w-full md:w-1/2 flex-col text-lg self-start  gap-1'>
          <label htmlFor='postalCode'>Postal Code</label>
          <input
            type='text'
            name='postalCode'
            id='postalCode'
            value={postalCode}
            disabled={!edit}
            onChange={e => setPostalCode(e.target.value)}
            className='w-full h-10 rounded-2xl md:text-lg py-1 px-4 border border-muted focus:outline-primary focus:border-none focus:outline-1'
          />
        </div>
        <button
          type='submit'
          className='rounded-2xl md:w-fit! border py-2 px-4 font-plus-jakarta-sans md:text-base! font-semibold! uppercase mt-4 text-main self-baseline-last gradient-button'
        >
          Continue to payment
          <FaArrowRightLong size={24} />
        </button>
      </form>
    </div>
  )
}

export default ShippingAddressForm
