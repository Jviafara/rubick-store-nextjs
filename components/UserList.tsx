import { useState } from 'react'
import UserTable from './UserTable'
import SearchBar from './SearchBar'
import { userSortBy } from '@/lib/constants'

const UserList = () => {
  const [query, setQuery] = useState('')
  const [adminFilter, setAdminFilter] = useState(false)
  const [sortBy, setSortBy] = useState<userSortBy>(userSortBy.latest)

  const selected = 'bg-gray-200'

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as userSortBy)
  }

  return (
    <div className='w-full h-full flex flex-col gap-4 items-baseline bg-gray-200/50 backdrop-blur-2xl p-4 rounded-xl'>
      <section className='w-full'>
        <h1 className='font-bold text-center uppercase text-xl'>User List</h1>
      </section>
      <section className='w-full flex items-center space-x-8'>
        {/* <SearchBar
          type='User'
          setQuery={setQuery}
        /> */}
        <button
          onClick={() => setAdminFilter(!adminFilter)}
          className={`${adminFilter && selected} h-8 font-semibold border border-gray-50 rounded-xl px-4 py-1  cursor-pointer`}
        >
          Admin
        </button>
        <div className='w-full flex items-center space-x-2'>
          <label
            htmlFor='sort-by'
            className='font-semibold mr-2'
          >
            Sort By:
          </label>
          <select
            name='sort-by'
            id='sort-by'
            value={sortBy}
            onChange={handleSortChange}
            className='h-8 border border-gray-50 rounded-xl px-2 py-1 '
          >
            {Object.values(userSortBy).map(sort => (
              <option
                key={sort}
                value={sort}
              >
                {sort}
              </option>
            ))}
          </select>
        </div>
      </section>
      <UserTable
        query={query}
        adminFilter={adminFilter}
        sortBy={sortBy}
      />
    </div>
  )
}

export default UserList
