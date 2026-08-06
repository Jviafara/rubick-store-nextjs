import OrderList from '@/components/OrderList'

const OrdersPage = () => {
  return (
    <div className='flex flex-col justify-center items-center my-4'>
      <h2 className='text-center text-3xl pb-4'>Order History</h2>
      <OrderList />
    </div>
  )
}

export default OrdersPage
