import { useSession } from '@/lib/auth/auth-client'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { FullUser, IOrder, StatusSelectorProps } from '@/lib/types'
import { ChevronDown } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { MdOutlineMoneyOff, MdPaid } from 'react-icons/md'
import { toast } from 'react-toastify'

const PaymentStatusSelector = ({ order, setOrders, setOrder, useLabel }: StatusSelectorProps) => {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()

  const dropdownRef = useRef<HTMLDivElement | null>(null)
  const [openPaymentStatusId, setOpenPaymentStatusId] = useState<string | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenPaymentStatusId(null)
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
      toast.success('Payment status updated successfully!')
    } else if (setOrder) {
      setOrder(res as IOrder)
      toast.success('Payment status updated successfully!')
    }

    dispatch(setGlobalLoading(false))
    setOpenPaymentStatusId(null)
  }
  return (
    <div
      className='relative'
      ref={openPaymentStatusId === order._id.toString() ? dropdownRef : undefined}
    >
      <button
        onClick={() => setOpenPaymentStatusId(openPaymentStatusId === order._id.toString() ? null : order._id.toString())}
        className={`flex items-center gap-2 border  rounded-lg shadow-sm text-wrap px-4 py-2 status-${order.isPaid ? 'paid' : 'unpaid'}`}
        disabled={(session?.user as FullUser).role !== 'admin'}
      >
        {order.isPaid ? (
          <p className='flex items-center gap-2 font-bold text-lg'>
            <MdPaid size={32} />
            {useLabel ? 'Paid' : ''}
          </p>
        ) : (
          <p className='flex items-center gap-2 font-bold text-lg'>
            <MdOutlineMoneyOff size={32} />
            {useLabel ? 'Waiting Payment' : ''}
          </p>
        )}
        {(session?.user as FullUser).role === 'admin' && <ChevronDown className='w-4 h-4' />}
      </button>
      {openPaymentStatusId === order._id.toString() && (
        <ul className='absolute left-0 mt-1 bg-white border rounded shadow-md z-50'>
          <li
            onClick={() => handleUpdate(order._id.toString(), undefined, true)}
            className='flex items-center gap-2 p-2 hover:bg-gray-100 cursor-pointer'
          >
            <MdPaid size={32} />
            <span>Paid</span>
          </li>
          <li
            onClick={() => handleUpdate(order._id.toString(), undefined, false)}
            className='flex items-center text-nowrap gap-2 p-2 hover:bg-gray-100 cursor-pointer'
          >
            <MdOutlineMoneyOff size={32} />
            <span>Waiting Payment</span>
          </li>
        </ul>
      )}
    </div>
  )
}

export default PaymentStatusSelector
