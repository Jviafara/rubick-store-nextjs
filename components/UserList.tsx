import { useState } from 'react'
import UserTable from './UserTable'
import SearchBar from './SearchBar'
import { userSortBy } from '@/lib/constants'
import { CiSearch } from 'react-icons/ci'

const UserList = () => {
  const [query, setQuery] = useState('')
  const [adminFilter, setAdminFilter] = useState(false)
  const [sortBy, setSortBy] = useState<userSortBy>(userSortBy.latest)

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as userSortBy)
  }

  return (
    <div className='w-full h-full flex flex-col gap-4 items-baseline bg-surface p-4 rounded-2xl'>
      <section className='w-full'>
        <h1 className='font-bold text-center uppercase text-xl'>User List</h1>
      </section>
      <section className='w-full flex items-center  space-x-8'>
        <div className='flex gap-2 items-center '>
          <CiSearch size={24} />
          <SearchBar
            type='User'
            query={query}
            setQuery={setQuery}
            handleSearchClick={() => {}}
          />
        </div>

        {/* Sort */}
        <div className=' flex items-center space-x-2'>
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
            className='h-8 border border-muted rounded-xl px-2 py-1 text-main bg-background'
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

        <button
          onClick={() => setAdminFilter(!adminFilter)}
          className={`${adminFilter && 'text-primary border border-primary text-lg! font-bold!'} text-muted text-sm  h-fit font-light rounded-xl  px-4  cursor-pointer uppercase text-center`}
        >
          Admin
        </button>
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
