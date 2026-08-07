import { IProduct } from '@/lib/types'
import ProductListItem from './ProductListItem'

interface Props {
  products: IProduct[]
  setQuery: React.Dispatch<React.SetStateAction<string>>
}

const SugestionsBox = ({ products, setQuery }: Props) => {
  return (
    <div className='absolute top-12 z-9999 w-full bg-surface rounded-lg p-4 max-h-[35vh] overflow-y-scroll scrollbar-none flex flex-col space-y-2'>
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
  )
}

export default SugestionsBox
