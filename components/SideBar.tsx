import Link from 'next/link'
import { useCallback, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import SearchBar from './SearchBar'
import { toogleModalService } from '@/lib/redux/features/modalSlice'
import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { useScrollLock } from '@/lib/hooks/useScrollLock'

const SideBar = () => {
  const pathname = usePathname()
  const [query, setQuery] = useState('')
  const router = useRouter()
  const dispatch = useAppDispatch()

  useScrollLock(true)

  const handleSearchClick = useCallback(() => {
    if (query === '') {
      return
    }

    dispatch(toogleModalService(false))
    router.push(`/products/?query=${query}`)
  }, [query, router, dispatch])

  return (
    <div className='w-screen md:w-fit h-full px-4 py-4 flex  flex-col space-y-4 justify-center'>
      <div className='border rounded-2xl px-2 py-4 flex flex-col gap-4'>
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleSearchClick={handleSearchClick}
        />
        <ul className='flex flex-col text-main text-xl'>
          <li className={`${pathname.includes('products') && 'bg-surface/90'} center-nav-li`}>
            <Link
              href='/products'
              onClick={() => dispatch(toogleModalService(false))}
            >
              Cubes
            </Link>
          </li>
          <li className={`${pathname.includes('tutorials') && 'bg-surface/90'} center-nav-li`}>
            <Link
              href='/tutorials'
              onClick={() => dispatch(toogleModalService(false))}
            >
              Tutorials
            </Link>
          </li>
          <li className={`${pathname.includes('timer') && 'bg-surface/90'} center-nav-li`}>
            <Link
              href='/timer'
              onClick={() => dispatch(toogleModalService(false))}
            >
              Timer
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default SideBar
