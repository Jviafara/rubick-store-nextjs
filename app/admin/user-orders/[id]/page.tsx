'use client'

import OrdersTable from '@/components/OrdersTable'

const UserOrders = () => {
  return (
    <main className='w-full  h-full p-8 flex flex-col gap-4 items-center'>
      <h1 className='text-2xl font-semibold '>Order History</h1>
      <section className='w-full max-w-6xl mx-auto flex flex-col items-center justify-center'>
        <OrdersTable />
      </section>
    </main>
  )
}

export default UserOrders
