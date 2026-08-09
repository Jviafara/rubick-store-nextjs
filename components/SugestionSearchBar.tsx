import { IProduct, ISugestionSearchBar } from '@/lib/types'
import { useEffect, useRef, useState } from 'react'
import { MdOutlineClose } from 'react-icons/md'
import SugestionsBox from './SugestionsBox'
import { productApi } from '@/lib/modules/productsApiClient'
import { useRouter, useSearchParams } from 'next/navigation'

const SugestionSearchBar = ({ query, setQuery, inputRef }: ISugestionSearchBar) => {
  const router = useRouter()
  const wrapperRef = useRef<HTMLDivElement>(null)
  const suggestionRef = useRef<HTMLDivElement>(null)
  const [products, setProducts] = useState<IProduct[]>([])
  const [isFocused, setIsFocused] = useState(false)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [isOutOfView, setIsOutOfView] = useState(false)

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
      getProducts(newQuery.toLocaleLowerCase())
      setShowSuggestions(true)
      return
    }

    setShowSuggestions(false)
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

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target
      if (!(target instanceof Node)) return

      const clickedInsideWrapper = wrapperRef.current?.contains(target)
      const clickedInsideSuggestions = suggestionRef.current?.contains(target)

      if (!clickedInsideWrapper && !clickedInsideSuggestions) {
        setIsFocused(false)
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)

    return () => {
      document.removeEventListener('mousedown', handlePointerDown)
    }
  }, [])

  useEffect(() => {
    const currentElement = inputRef!.current
    if (!currentElement) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting is false when the element leaves the viewport
        setIsOutOfView(!entry.isIntersecting)

        // Fire your custom out-of-view event here if needed
        if (!entry.isIntersecting) {
          console.log('Element has gone out of view!')
        }
      },
      {
        root: null, // Defaults to the browser viewport
        threshold: 0, // Triggers as soon as even 1 pixel leaves/enters
      },
    )

    observer.observe(currentElement)

    return () => {
      if (currentElement) observer.unobserve(currentElement)
    }
  }, [inputRef])

  const handleClearSearch = () => {
    setQuery('')
    setProducts([])
    setShowSuggestions(false)
  }
  return (
    <div
      ref={wrapperRef}
      className='relative'
    >
      <input
        ref={inputRef}
        type='text'
        name='address'
        id='address'
        value={query}
        onChange={onQueryChange}
        onFocus={() => {
          setIsFocused(true)
          if (query.length >= 3) setShowSuggestions(true)
        }}
        className='w-[33vw]  h-8 rounded-lg text-lg py-1 px-4 text-center  focus:outline-none peer'
      />
      {query && (
        <MdOutlineClose
          size={24}
          onClick={handleClearSearch}
          className='absolute right-0 top-1/2 -translate-y-1/2 text-main cursor-pointer '
        />
      )}
      {isFocused && showSuggestions && query.length >= 3 && query !== activeQuery && !isOutOfView && (
        <SugestionsBox
          products={products}
          setQuery={setQuery}
          suggestionsRef={suggestionRef}
        />
      )}
    </div>
  )
}

export default SugestionSearchBar
