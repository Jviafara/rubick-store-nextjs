import React, { useEffect, useState } from 'react'
import AutoSwiper from './AutoSwiper'
import { SwiperSlide } from 'swiper/react'
import AddressCard from './AddressCard'
import { AddressApi } from '@/lib/modules/addressApiClient'
import { toast } from 'react-toastify'
import { FullUser, IShippingAddress } from '@/lib/types'
import { CiCirclePlus } from 'react-icons/ci'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { setModalService } from '@/lib/redux/features/modalSlice'
import { ModalPositions } from '@/lib/constants'
import AddressForm from './AddressForm'
import { useSession } from '@/lib/auth/auth-client'

const AdressesSlider = () => {
  const [addresses, setAddresses] = useState<IShippingAddress[]>([])
  const { data: session, refetch } = useSession()
  const dispatch = useAppDispatch()

  const getAddresses = async () => {
    const { res, error } = await AddressApi.list()

    if (res.status || error) {
      toast.error(res.message)
      return
    }
    setAddresses(res)
  }

  useEffect(() => {
    const firstLoad = async () => {
      getAddresses()
    }
    firstLoad()
  }, [])

  const handleModalOpen = async (addressId?: string) => {
    if (addressId) {
      dispatch(
        setModalService({
          modalOpen: true,
          header: `Edit address.`,
          children: (
            <AddressForm
              addressId={addressId}
              onSuccess={getAddresses}
            />
          ),
          icon: undefined,
          position: ModalPositions.center,
        }),
      )
    } else {
      dispatch(
        setModalService({
          modalOpen: true,
          header: `Create address.`,
          children: <AddressForm onSuccess={getAddresses} />,
          icon: undefined,
          position: ModalPositions.center,
        }),
      )
    }
  }

  const handleDelete = async (addressId: string) => {
    const { res, error } = await AddressApi.delete(addressId)
    if (res.status || error) toast.error(res.message)

    await refetch()
    getAddresses()
  }

  return (
    <>
      <AutoSwiper slideNumber={addresses.length}>
        <SwiperSlide className='swiper-slide w-fit! overflow-visible flex! items-center h-full mx-4'>
          <button
            onClick={() => handleModalOpen()}
            className='flex items-center gap-2 px-4 py-2 border border-muted rounded-2xl bg-surface/50 hover:bg-surface hover:scale-110'
          >
            <CiCirclePlus size={24} /> Add Address
          </button>
        </SwiperSlide>
        {addresses.find(address => address._id === (session?.user as FullUser).defaultAddress) && (
          <SwiperSlide className='swiper-slide w-fit overflow-x-visible'>
            <AddressCard
              address={addresses.find(address => address._id === (session?.user as FullUser).defaultAddress)}
              handleEditModalOpen={handleModalOpen}
              handleDelete={handleDelete}
            />
          </SwiperSlide>
        )}

        {addresses &&
          addresses
            .filter((address: IShippingAddress) => address._id !== (session?.user as FullUser).defaultAddress)
            .map((address, index) => (
              <SwiperSlide
                key={index}
                className='swiper-slide w-fit overflow-x-visible'
              >
                <AddressCard
                  address={address}
                  handleEditModalOpen={handleModalOpen}
                  handleDelete={handleDelete}
                />
              </SwiperSlide>
            ))}
      </AutoSwiper>
    </>
  )
}

export default AdressesSlider
