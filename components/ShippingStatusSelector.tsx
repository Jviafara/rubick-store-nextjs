import { ChevronDown } from 'lucide-react'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { FullUser, IOrder, StatusSelectorProps } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { FaNotdef } from 'react-icons/fa6'
import { FiPackage } from 'react-icons/fi'
import { FcShipped } from 'react-icons/fc'
import { shippingStatus } from '@/lib/constants'
import { useSession } from '@/lib/auth/auth-client'

const ShippingStatusSelector = ({ order, setOrders, setOrder, useLabel }: StatusSelectorProps) => {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [openShippingStatusId, setOpenShippingStatusId] = useState<string | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenShippingStatusId(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const handleUpdate = async (orderId: string, shippinsStatus?: string, isPaid?: boolean) => {
    dispatch(setGlobalLoading(true))
    const { res, error } = await OrdersApi.update({
      orderId,
      shippingStatus: shippinsStatus,
      isPaid,
    })

    if (res?.status || error) {
      toast.error(res?.message || 'Shipping status update failed.')
    } else if (setOrders) {
      if (shippinsStatus !== undefined && isPaid !== undefined) {
        setOrders(prevOrders => prevOrders.map(order => (order._id.toString() === orderId ? ({ ...order, shippingStatus: shippinsStatus, isPaid } as IOrder) : order)))
      } else if (shippinsStatus !== undefined) {
        setOrders(prevOrders => prevOrders.map(order => (order._id.toString() === orderId ? ({ ...order, shippingStatus: shippinsStatus } as IOrder) : order)))
      } else if (isPaid !== undefined) {
        setOrders(prevOrders => prevOrders.map(order => (order._id.toString() === orderId ? ({ ...order, isPaid } as IOrder) : order)))
      }
      toast.success('Shipping status updated successfully!')
    } else if (setOrder) {
      setOrder(res)
      toast.success('Shipping status updated successfully!')
    }

    dispatch(setGlobalLoading(false))
    setOpenShippingStatusId(null)
  }
  return (
    <div
      className='relative'
      ref={openShippingStatusId === order._id.toString() ? dropdownRef : undefined}
    >
      <button
        onClick={() => setOpenShippingStatusId(openShippingStatusId === order._id.toString() ? null : order._id.toString())}
        className={`flex items-center gap-2 border  rounded-lg shadow-sm text-wrap px-4 py-2 status-${order.shippingStatus}`}
        disabled={(session?.user as FullUser).role !== 'admin'}
      >
        {order.shippingStatus === 'pending' ? (
          <p className='flex items-center gap-2 font-bold text-lg'>
            <FaNotdef size={32} />
            {useLabel ? 'Waiting Shipping' : ''}
          </p>
        ) : order.shippingStatus === 'delivered' ? (
          <p className='flex items-center gap-2 font-bold text-lg'>
            <FiPackage size={32} />
            {useLabel ? 'Delivered' : ''}
          </p>
        ) : (
          <p className='flex items-center gap-2 font-bold text-lg'>
            <FcShipped size={32} />
            {useLabel ? 'Shipped' : ''}
          </p>
        )}
        {(session?.user as FullUser).role === 'admin' && <ChevronDown className='w-4 h-4' />}
      </button>
      {openShippingStatusId === order._id.toString() && (
        <ul className='absolute left-0 mt-1 bg-white border rounded shadow-md z-50'>
          {Object.values(shippingStatus).map(status => (
            <li
              key={status}
              onClick={() => handleUpdate(order._id.toString(), status)}
              className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
            >
              {status === 'pending' ? <FaNotdef size={32} /> : status === 'delivered' ? <FiPackage size={32} /> : <FcShipped size={32} />}
              <span>{status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShippingStatusSelector
