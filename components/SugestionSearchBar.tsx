import { IProduct, ISugestionSearchBar } from '@/lib/types'
import { useEffect, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import SugestionsBox from './SugestionsBox'
import { productApi } from '@/lib/modules/productsApiClient'
import { useRouter, useSearchParams } from 'next/navigation'

const SugestionSearchBar = ({ query, setQuery, inputRef }: ISugestionSearchBar) => {
  const router = useRouter()
  const [products, setProducts] = useState<IProduct[]>([])

  const searchParams = useSearchParams()
  const activeQuery = searchParams.get('query') || ''

  useEffect(() => {
    if (activeQuery) {
      setQuery(activeQuery)
      return
    }

    setQuery('')
    const clearProducts = () => setProducts([])
    clearProducts()
  }, [activeQuery, setQuery])

  const getProducts = async (query: string) => {
    const { res, error } = await productApi.getQueryList(query)

    if (res?.status || error) {
      setProducts([])
      return
    }

    if (res) {
      setProducts(res.slice(0, 8))
    }
  }

  const onQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value
    setQuery(newQuery)

    if (newQuery.length >= 3) {
      console.log(newQuery)
      getProducts(newQuery.toLocaleLowerCase())
      return
    }
  }

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && event.target instanceof HTMLInputElement) {
        router.push(`/products/?query=${query}`)
        setQuery('')
        event.preventDefault()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [query, router, setQuery])

  const handleClearSearch = () => {
    setQuery('')
    setProducts([])
  }
  return (
    <div className='w-full relative'>
      <input
        ref={inputRef}
        type='text'
        name='address'
        id='address'
        value={query}
        onChange={onQueryChange}
        className='w-lg h-8 rounded-lg text-lg py-1 px-4 text-center  focus:outline-none'
      />
      {query && (
        <MdOutlineClose
          size={24}
          onClick={handleClearSearch}
          className='absolute right-0 top-1/2 -translate-y-1/2 text-main cursor-pointer'
        />
      )}
      {query.length >= 3 && query !== activeQuery && (
        <SugestionsBox
          products={products}
          setQuery={setQuery}
        />
      )}
    </div>
  )
}

export default SugestionSearchBar
