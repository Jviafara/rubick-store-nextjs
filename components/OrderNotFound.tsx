import { usePathname } from 'next/navigation'
import { AiFillExclamationCircle } from 'react-icons/ai'

const OrderNotFound = () => {
  const pathname = usePathname()

  const label = pathname.includes('/user-orders') ? 'No Orders completed yet!' : 'Order Not Found'
  return (
    <div className='w-fit flex items-center justify-center gap-4 rounded-xl bg-red-200 p-6'>
      <AiFillExclamationCircle
        size={32}
        color='red'
      />
      <p className='text-2xl text-center flex justify-center text-red-700'>{label}</p>
    </div>
  )
}

export default OrderNotFound
