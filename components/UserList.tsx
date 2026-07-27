import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { userApi } from '@/lib/modules/userApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { FullUser } from '@/lib/types'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'

const UserList = () => {
  const dispatch = useAppDispatch()
  const [users, setUsers] = useState<FullUser[]>([])

  useEffect(() => {
    const getUsers = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await userApi.getList()
      if (res.status === 404) {
        toast.error('Product not found')
      }
      if (res.status === 401) return
      setUsers(res)
      dispatch(setGlobalLoading(false))
      if (error) toast.error(error.toString())
    }
    getUsers()
  }, [dispatch])

  return (
    <div className='w-full h-full flex flex-col gap-4 items-baseline bg-gray-200/50 backdrop-blur-2xl p-4 rounded-xl'>
      <section className='w-full'>
        <h1 className='font-bold text-center uppercase text-xl'>User List</h1>
      </section>
      <section className='w-full flex flex-col items-center '>
        <table className='w-full border-collapse text-left table-fixed'>
          <thead className='w-full text-center'>
            <tr className='w-full'>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th className='text-center!'>Orders</th>
            </tr>
          </thead>
          <tbody className='w-full'>
            {users?.map((user, index) => (
              <tr
                key={index}
                className='w-full'
              >
                <td className='uppercase font-semibold'>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span className='mr-2'>({user.prefix ? user.prefix : ''})</span>
                  {user.phone ? user.phone : 'NN'}
                </td>
                <td className='flex justify-center'>
                  <button className='cursor-pointer px-2 py-1 border border-gray-400 rounded-xl bg-blue-400/60 hover:bg-blue-500'>
                    See orders
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  )
}

export default UserList
