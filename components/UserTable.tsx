import { FullUser } from '@/lib/types'
import UserNotFound from './UserNotFound'

const UserTable = ({ users }: { users: FullUser[] }) => {
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
                  <button className='cursor-pointer px-2 py-1 border border-gray-400 rounded-xl bg-blue-400/60 hover:bg-blue-500'>See orders</button>
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
