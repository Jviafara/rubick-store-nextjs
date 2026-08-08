import { IProduct } from '@/lib/types'
import ProductListItem from './ProductListItem'
import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface Props {
  products: IProduct[]
  setQuery: React.Dispatch<React.SetStateAction<string>>
  suggestionsRef?: React.RefObject<HTMLDivElement | null>
}

const SugestionsBox = ({ products, setQuery, suggestionsRef }: Props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const mountSidebar = () => {
      setMounted(true)
      return () => setMounted(false)
    }
    mountSidebar()
  }, [])

  if (!mounted || typeof document === 'undefined') return null

  return createPortal(
    <div className='absolute top-18 left-0 z-0 w-full h-screen max-w-[100vw] bg-black/30 '>
      <div
        ref={suggestionsRef}
        className='relative top-0 left-1/2 -translate-x-1/2 z-50 w-[33vw] max-w-xl hidden md:inline-flex bg-surface rounded-lg p-4 max-h-[35vh] overflow-y-scroll scrollbar-none  flex-col space-y-2'
      >
        {products.length > 0 ? (
          products.map(product => (
            <ProductListItem
              key={product.slug}
              product={product}
              setQuery={setQuery}
            />
          ))
        ) : (
          <p className='text-sm'>Product Not found</p>
        )}
      </div>
    </div>,
    document.body,
  )
}

export default SugestionsBox
