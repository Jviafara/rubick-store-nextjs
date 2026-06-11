import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { addcartItem } from '@/lib/redux/features/cartSlice'
import { ProductCardProps } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { AiFillHeart, AiOutlineShoppingCart } from 'react-icons/ai'
import { toast } from 'react-toastify'
import Ratings from './Ratings'

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch()

  const { favoriteList } = useAppSelector(state => state.favoriteList)
  const { cartItems } = useAppSelector(state => state.cart)
  const [isFavorito, setIsFavorito] = useState(false)

  useEffect(() => {
    const checkIsFav = () => {
      const fav = favoriteList.find(item => item.product === product._id)
      if (fav) setIsFavorito(true)
    }
    checkIsFav()
  }, [favoriteList, product])

  const addToCartHandler = async () => {
    console.log(cartItems[0], product._id)
    const existItem = cartItems?.find(x => x._id === product._id)
    console.log(existItem)
    const quantity = existItem ? existItem.quantity + 1 : 1
    console.log(quantity)

    if (product.countInStock! < quantity) {
      toast.error('Product Out of Stock')
      return
    }

    dispatch(addcartItem({ ...product, quantity }))
  }
  return (
    <div className='w-fit h-full group duration-300 rounded-lg overflow-visible'>
      <div className='bg-gray-200  bg-opacity-50 backdrop-blur-2xl flex flex-col gap-2 w-fit h-full border border-pink rounded-lg shadow-md group-hover:shadow-xl hover:scale-105 duration-300'>
        <div className='object-center flex items-center justify-center'>
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
              color='red'
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCard
