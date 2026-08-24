import { ChevronDown } from 'lucide-react'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { OrdersApi } from '@/lib/modules/orderApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { FullUser, IFullOrder, StatusSelectorProps } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'
import { toast } from 'react-toastify'
import { FiPackage } from 'react-icons/fi'
import { FcShipped } from 'react-icons/fc'
import { shippingStatus } from '@/lib/constants'
import { useSession } from '@/lib/auth/auth-client'
import { usePathname } from 'next/navigation'
import { IoMdTimer } from 'react-icons/io'
import { TbCancel } from 'react-icons/tb'

const ShippingStatusSelector = ({ order, setOrders, setOrder }: StatusSelectorProps) => {
  const dispatch = useAppDispatch()
  const { data: session } = useSession()
  const pathname = usePathname()

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
        setOrders(prevOrders => prevOrders.map(order => (order._id.toString() === orderId ? ({ ...order, shippingStatus: shippinsStatus, isPaid } as IFullOrder) : order)))
      } else if (shippinsStatus !== undefined) {
        setOrders(prevOrders => prevOrders.map(order => (order._id.toString() === orderId ? ({ ...order, shippingStatus: shippinsStatus } as IFullOrder) : order)))
      } else if (isPaid !== undefined) {
        setOrders(prevOrders => prevOrders.map(order => (order._id.toString() === orderId ? ({ ...order, isPaid } as IFullOrder) : order)))
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
        disabled={(session?.user as FullUser).role !== 'admin' || !pathname.includes('order')}
      >
        <p
          className={`flex w-fit items-center gap-2 px-4 py-2 rounded-2xl uppercase  font-plus-jakarta-sans ${
            order.shippingStatus === 'cancel'
              ? 'text-main font-semibold bg-secondary/60'
              : order.shippingStatus === 'delivered'
                ? 'text-tertiary font-extrabold bg-tertiary/20'
                : order.shippingStatus === 'processing'
                  ? 'text-accent font-extrabold bg-accent/20'
                  : 'text-primary font-semibold bg-primary/20'
          }`}
        >
          {order.shippingStatus === 'cancel' ? (
            <TbCancel size={20} />
          ) : order.shippingStatus === 'delivered' ? (
            <FcShipped size={20} />
          ) : order.shippingStatus === 'processing' ? (
            <IoMdTimer size={20} />
          ) : (
            <FiPackage size={20} />
          )}
          <span>{order.shippingStatus}</span>
          {(session?.user as FullUser).role === 'admin' && pathname.includes('order') && <ChevronDown className='w-4 h-4' />}
        </p>
      </button>
      {openShippingStatusId === order._id.toString() && (
        <ul className='absolute left-0 mt-1 bg-surface border border-muted rounded-2xl shadow-md z-50'>
          {Object.values(shippingStatus).map(status => (
            <li
              key={status}
              onClick={() => handleUpdate(order._id.toString(), status)}
              className={`flex w-full items-center gap-2 px-4 py-2 rounded-2xl uppercase text-main font-semibold font-plus-jakarta-sans ${
                status === 'cancel'
                  ? 'hover:text-secondary hover:bg-secondary/20'
                  : status === 'delivered'
                    ? 'hover:text-tertiary hover:bg-tertiary/20'
                    : status === 'processing'
                      ? 'hover:text-tertiary hover:bg-tertiary/20'
                      : 'hover:bg-muted/30'
              }`}
            >
              {status === 'cancel' ? (
                <TbCancel size={20} />
              ) : status === 'delivered' ? (
                <FcShipped size={20} />
              ) : status === 'processing' ? (
                <IoMdTimer size={20} />
              ) : (
                <FiPackage size={20} />
              )}
              <span>{status}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default ShippingStatusSelector
