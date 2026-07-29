import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { userApi } from '@/lib/modules/userApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { FullUser } from '@/lib/types'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import UserTable from './UserTable'
import SearchBar from './SearchBar'

const UserList = () => {
  const dispatch = useAppDispatch()
  const [users, setUsers] = useState<FullUser[]>([])
  const [query, setQuery] = useState('')
  const [adminFilter, setAdminFilter] = useState(false)

  const selected = 'bg-gray-200'

  useEffect(() => {
    const getUsers = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await userApi.getList()
      if (res.status === 404) {
        toast.error('Users not found')
        return
      }
      if (res.status === 401) return

      if (adminFilter) {
        setUsers(
          res.filter(
            (user: FullUser) => user.role === 'admin' && (user.name?.toLowerCase()?.includes(query.toLowerCase()) || user.email?.toLowerCase()?.includes(query.toLowerCase())),
          ),
        )
      } else {
        setUsers(res.filter((user: FullUser) => user.name?.toLowerCase()?.includes(query.toLowerCase()) || user.email?.toLowerCase()?.includes(query.toLowerCase())))
      }

      dispatch(setGlobalLoading(false))
      if (error) toast.error(error.toString())
    }
    getUsers()
  }, [dispatch, query,adminFilter])

  return (
    <div className='w-full h-full flex flex-col gap-4 items-baseline bg-gray-200/50 backdrop-blur-2xl p-4 rounded-xl'>
      <section className='w-full'>
        <h1 className='font-bold text-center uppercase text-xl'>User List</h1>
      </section>
      <section className='w-full flex items-center'>
        <SearchBar
          type='User'
          setQuery={setQuery}
        />
        <button
          onClick={() => setAdminFilter(!adminFilter)}
          className={`${adminFilter && selected} font-semibold border border-gray-200 rounded-xl px-4 py-1  cursor-pointer`}
        >
          Admin
        </button>
      </section>
      <UserTable users={users} />
    </div>
  )
}

export default UserList
