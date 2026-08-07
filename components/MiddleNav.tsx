import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { AiOutlineSearch } from 'react-icons/ai'
import SugestionSearchBar from './SugestionSearchBar'
import { useCallback, useEffect, useRef, useState } from 'react'

const MiddleNav = () => {
  const pathname = usePathname()
  const [searchBarOpen, setSearchBarOpen] = useState(false)
  const [query, setQuery] = useState('')
  const router = useRouter()

  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (searchBarOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [searchBarOpen])

  const handleSearchClick = useCallback(() => {
    if (searchBarOpen) {
      if (query === '') {
        setSearchBarOpen(false)
        return
      }

      router.push(`/products/?query=${query}`)
      setSearchBarOpen(false)
      return
    }
    setSearchBarOpen(true)
  }, [query, router, searchBarOpen])

  return (
    <div className='hidden  md:inline-flex items-center space-x-4 absolute top-0 left-1/2 -translate-x-1/2 border-3 border-surface/70 py-0.5 px-1 rounded-full'>
      {searchBarOpen ? (
        <div className='w-full px-2 py-1 relative'>
          <SugestionSearchBar
            query={query}
            setQuery={setQuery}
            inputRef={inputRef}
            handleSearchClick={handleSearchClick}
          />
        </div>
      ) : (
        <ul className='flex items-center space-x-4'>
          <li className={`${pathname.includes('products') && 'bg-surface/90'} center-nav-li`}>
            <Link href='/products'>Cubes</Link>
          </li>
          <li className={`${pathname.includes('tutorials') && 'bg-surface/90'} center-nav-li`}>
            <Link href='/tutorials'>Tutorials</Link>
          </li>
          <li className={`${pathname.includes('timer') && 'bg-surface/90'} center-nav-li`}>
            <Link href='/timer'>Timer</Link>
          </li>
        </ul>
      )}

      <button
        onClick={handleSearchClick}
        className='cursor-pointer mr-2 hidden md:inline-flex'
      >
        <AiOutlineSearch size={28} />
      </button>
    </div>
  )
}

export default MiddleNav
