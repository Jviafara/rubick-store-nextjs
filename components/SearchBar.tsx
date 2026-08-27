import { SearchBarProps } from '@/lib/types'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'

const SearchBar = ({ setQuery, type, query = '', handleSearchClick }: SearchBarProps) => {
  const searchParams = useSearchParams()
  const activeQuery = searchParams.get('query') || ''
  const [text, setText] = useState(activeQuery)

  useEffect(() => {
    if (!text) {
      setQuery(text)
    }
    const timer = setTimeout(() => {
      if (text.length < 3 && text) {
        return
      }
      setQuery(text)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [setQuery, text])

  useEffect(() => {
    if (activeQuery) {
      setQuery(activeQuery)
      return
    }
    setQuery('')
  }, [activeQuery, setQuery])

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setText(newQuery)
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
        handleSearchClick()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleSearchClick])

  return (
    <div className='flex items-center justify-center gap-4 relative'>
      <input
        type='text'
        value={text}
        autoComplete='off'
        onChange={onQueryChange}
        placeholder={type && `Search ${type}`}
        className='w-full h-8 rounded-lg text-lg py-1 px-4 text-center border border-gray-50 focus:outline-blue-500 focus:border-none focus:outline-1'
      />
      {query && (
        <AiOutlineSearch
          size={24}
          onClick={handleSearchClick}
          className='absolute right-0 top-1/2 -translate-y-1/2 text-main cursor-pointer '
        />
      )}
    </div>
  )
}

export default SearchBar
