import { useSession } from '@/lib/auth/auth-client'
import { FullUser, IShippingAddress } from '@/lib/types'
import { CiTrash } from 'react-icons/ci'

import { MdOutlineModeEditOutline } from 'react-icons/md'

interface IAddressCard {
  address?: IShippingAddress
  handleEditModalOpen: (addressId: string) => void
  handleDelete: (addressId: string) => void
}

const AddressCard = ({ address, handleEditModalOpen, handleDelete }: IAddressCard) => {
  const { data: session } = useSession()

  if (!address) return null

  return (
    <div
      className={`${address._id === (session?.user as FullUser).defaultAddress ? 'card-gradient-cyan-magenta' : 'card-base'} max-w-[90%] md:max-w-full`}
    >
      <section className='w-full flex flex-col gap-2 border border-muted rounded-2xl bg-surface/70 px-4 py-4 '>
        <div className='w-full flex justify-between items-center gap-8'>
          <h1 className='font-plus-jakarta-sans'>
            Deliver to <span className='font-semibold uppercase'>{address.name}</span>
          </h1>
          <div className='flex gap-2'>
            <button
              onClick={() => handleEditModalOpen(address._id.toString())}
              className='border border-muted text-muted rounded-full p-1'
            >
              <MdOutlineModeEditOutline />
            </button>
            <button
              onClick={() => handleDelete(address._id.toString())}
              className='border border-muted text-muted rounded-full p-1'
            >
              <CiTrash />
            </button>
          </div>
        </div>
        <div className='flex flex-col gap-0'>
          <div>
            <p>{address.address}</p>
            <p>{address.phone}</p>
          </div>
          <p>
            {address.city}, {address.country}
          </p>
          <p>{address.postalCode}</p>
        </div>
      </section>
    </div>
  )
}

export default AddressCard
