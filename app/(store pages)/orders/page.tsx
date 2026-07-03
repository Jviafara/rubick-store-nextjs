import OrderList from '@/components/OrderList'

const OrdersPage = () => {
  return (
    <div className='flex flex-col justify-center items-center'>
      <div>
        <h2 className='text-center text-3xl pb-4'>Order History</h2>
        <OrderList />
      </div>
    </div>
  )
}

export default OrdersPage
