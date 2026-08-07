import { IProduct } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'

interface Props {
  product: IProduct
  setQuery: React.Dispatch<React.SetStateAction<string>>
}

const ProductListItem = ({ product, setQuery }: Props) => {
  return (
    <Link
      href={`/product/slug/${product.slug}`}
      onClick={() => setQuery('')}
      className='flex space-x-3 items-center hover:bg-background px-4 py-2 rounded-2xl cursor-pointer '
    >
      <div className='flex gap-2 justify-center'>
        <Image
          src={product.images![0]}
          alt={'Images'}
          loading='eager'
          width={500}
          height={500}
          className='w-12 bg-cover rounded-lg'
        />
      </div>
      <h1>{product.name}</h1>
    </Link>
  )
}

export default ProductListItem
