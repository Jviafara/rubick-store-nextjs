import { FullUser, UserTableProps } from '@/lib/types'
import UserNotFound from './UserNotFound'
import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { userApi } from '@/lib/modules/userApiClient'
import { toast } from 'react-toastify'
import { userSortBy } from '@/lib/constants'
import { getDate } from '@/lib/utils'
import Link from 'next/link'

const UserTable = ({ query, adminFilter, sortBy }: UserTableProps) => {
  const dispatch = useAppDispatch()
  const [users, setUsers] = useState<FullUser[]>([])

  useEffect(() => {
    const getUsers = async () => {
      const { res, error } = await userApi.getList()
      if (res.status === 404) {
        toast.error('Users not found')
        return
      }
      if (res.status === 401) return

      if (adminFilter) {
        const fileterUsers = res.filter(
          (user: FullUser) =>
            user.role === 'admin' &&
            (user.name?.toLowerCase()?.includes(query.toLowerCase()) ||
              user.email?.toLowerCase()?.includes(query.toLowerCase())),
        )
        if (sortBy === userSortBy.latest) {
          setUsers(fileterUsers.sort((a: FullUser, b: FullUser) => getDate(b).getTime() - getDate(a).getTime()))
        } else if (sortBy === userSortBy.oldest) {
          setUsers(fileterUsers.sort((a: FullUser, b: FullUser) => getDate(a).getTime() - getDate(b).getTime()))
        } else if (sortBy === userSortBy.alphabetical) {
          setUsers(
            fileterUsers.sort((a: FullUser, b: FullUser) =>
              a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()),
            ),
          )
        } else {
          setUsers(fileterUsers)
        }
      } else {
        const fileterUsers = res.filter(
          (user: FullUser) =>
            user.name?.toLowerCase()?.includes(query.toLowerCase()) ||
            user.email?.toLowerCase()?.includes(query.toLowerCase()),
        )
        if (sortBy === userSortBy.latest) {
          setUsers(fileterUsers.sort((a: FullUser, b: FullUser) => getDate(b).getTime() - getDate(a).getTime()))
        } else if (sortBy === userSortBy.oldest) {
          setUsers(fileterUsers.sort((a: FullUser, b: FullUser) => getDate(a).getTime() - getDate(b).getTime()))
        } else if (sortBy === userSortBy.alphabetical) {
          setUsers(
            fileterUsers.sort((a: FullUser, b: FullUser) =>
              a.name.toLocaleLowerCase().localeCompare(b.name.toLocaleLowerCase()),
            ),
          )
        } else {
          setUsers(fileterUsers)
        }
      }

      if (error) toast.error(error.toString())
    }
    getUsers()
  }, [dispatch, query, adminFilter, sortBy])

  return (
    <section className='w-full flex flex-col items-center '>
      {users.length <= 0 ? (
        <UserNotFound />
      ) : (
        <table className='w-full border-collapse text-left table-fixed'>
          <thead className='w-full text-center'>
            <tr className='w-full'>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
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
                <td>{user.phone ? user.phone : 'NN'}</td>
                <td className='uppercase font-semibold'>{user.role}</td>
                <td className='flex justify-center'>
                  <Link
                    href={`/admin/user-orders/${user._id}`}
                    target='_blank'
                    className='cursor-pointer px-2 py-1 text-main rounded-xl bg-primary/60 hover:bg-primary/90'
                  >
                    See orders
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}

export default UserTable
