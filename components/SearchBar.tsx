import { SearchBarProps } from '@/lib/types'
import React from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

let timer: ReturnType<typeof setTimeout>
const timeout = 500

const SearchBar = ({ setQuery }: SearchBarProps) => {
  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    clearTimeout(timer)

    timer = setTimeout(() => {
      setQuery(newQuery)
    }, timeout)
  }
  return (
    <div className='lg:w-[30%] flex items-center justify-center gap-4 py-4 px-8'>
      <AiOutlineSearch size={32} />
      <input
        type='text'
        name='address'
        id='address'
        onChange={onQueryChange}
        placeholder='Search Products'
        className='w-full h-8 rounded-lg text-lg py-1 px-4 text-center border border-gray-50 focus:outline-blue-500 focus:border-none focus:outline-1'
      />
    </div>
  )
}

export default SearchBar
