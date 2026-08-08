import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { addcartItem } from '@/lib/redux/features/cartSlice'
import { ProductCardProps } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { FaHeart } from 'react-icons/fa'

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch()

  const { favoriteList } = useAppSelector(state => state.favoriteList)
  const { cartItems } = useAppSelector(state => state.cart)
  const isFavorito = Boolean(favoriteList.some(item => item.product === product._id))

  const addToCartHandler = async () => {
    const existItem = cartItems?.find(x => x._id === product._id)
    const quantity = existItem ? existItem.quantity + 1 : 1

    if (product.countInStock! < quantity) {
      toast.error('Product Out of Stock')
      return
    }

    dispatch(addcartItem({ ...product, quantity }))
  }
  return (
    <div
      className={`relative w-full h-full flex flex-col justify-between gap-4 rounded-xl ${isFavorito ? 'card-gradient-featured' : 'card-base hover-gradient-cyan-magenta'}  text-main p-3`}
    >
      {/* Image */}
      <Link href={`/product/slug/${product.slug}`}>
        <div className='relative w-full aspect-square '>
          <Image
            src={product.images![0]}
            alt={'Image'}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            loading='eager'
            className='object-cover z-0 rounded-2xl'
          />
        </div>
        <div></div>
      </Link>

      <section className='w-full'>
        <div className=''>{product.category}</div>
        <div className='w-full flex justify-between items-center'>
          <Link
            href={`/product/slug/${product.slug}`}
            className='font-inter font-bold text-lg max-w-[75%] text-nowrap truncate hover:text-muted'
          >
            {product.name}
          </Link>
          <button
            onClick={addToCartHandler}
            type='button'
            className={`rounded-full ${isFavorito ? 'hover:text-accent/70' : 'hover:text-secondary/70'}   p-1`}
          >
            <AiOutlineShoppingCart size={32} />
          </button>
        </div>
      </section>

      {/* name */}

      {/* Favorite heart */}
      {isFavorito && (
        <div className='absolute top-2 right-2'>
          <FaHeart
            size={24}
            className='text-secondary'
          />
        </div>
      )}

      {/* <div className='bg-gray-200  bg-opacity-50 backdrop-blur-2xl flex flex-col gap-2 w-fit h-full border border-pink rounded-lg shadow-md group-hover:shadow-xl duration-300 '>
        <div className='object-center flex items-center justify-center '>
          <Link href={`/product/slug/${product.slug}`}>
            <Image
              src={product.images![0]}
              width={500}
              height={500}
              loading='eager'
              alt={product.name}
              className='w-37.5 h-37.5 sm:w-50 sm:h-50 lg:w-75 lg:h-75 rounded-lg'
            />
          </Link>
        </div>
        <div className='px-2 py-4 lg:py-8 text-center flex flex-col items-center font-bold'>
          <Link href={`/product/slug/${product.slug}`}>
            <p className='text-lg xl:text-xl'>{product.name}</p>
          </Link>
          <Ratings
            rating={product.rating}
            numReviews={product.numReviews}
          />
          <p className='mt-1 text-lg'>
            <strong>${product.price}</strong>
          </p>
          {product.countInStock === 0 ? (
            <button
              onClick={addToCartHandler}
              type='button'
              disabled
              className='rounded-lg bg-[#faa784] mt-1 p-1 w-fullfont-bold text-sm'
            >
              Out of Stock
            </button>
          ) : (
            <button
              onClick={addToCartHandler}
              type='button'
              className='rounded-lg hover:bg-[#faa784] px-2 py-1'
            >
              <AiOutlineShoppingCart
                size={28}
                color='black'
              />
            </button>
          )}
        </div>
        {isFavorito && (
          <div className='absolute top-0 right-0'>
            <AiFillHeart
              size={32}
              co lor='red'
            />
          </div>
        )}
      </div> */}
    </div>
  )
}

export default ProductCard
