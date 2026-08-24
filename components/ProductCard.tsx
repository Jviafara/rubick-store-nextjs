import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { addcartItem } from '@/lib/redux/features/cartSlice'
import { ICartItem, ProductCardProps } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { AiOutlineShoppingCart } from 'react-icons/ai'
import { toast } from 'react-toastify'
import { FaHeart } from 'react-icons/fa'
import { BsCurrencyDollar } from 'react-icons/bs'
import Ratings from './Ratings'
import { useEffect, useState } from 'react'

const ProductCard = ({ product }: ProductCardProps) => {
  const dispatch = useAppDispatch()

  const { favoriteList } = useAppSelector(state => state.favoriteList)
  const { cartItems } = useAppSelector(state => state.cart)
  const isFavorito = Boolean(favoriteList.some(item => item.product === product._id))
  const [inCart, setInCart] = useState<ICartItem | null>(null)

  useEffect(() => {
    const checkInCart = () => {
      if (cartItems.filter(item => item._id === product._id)) setInCart(cartItems.filter(item => item._id === product._id)[0])
    }
    checkInCart()
  }, [cartItems, product])

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
      className={`relative w-full max-w-[90%] items-stretch justify-stretch h-full flex flex-col gap-4 rounded-xl ${isFavorito ? 'card-gradient-featured' : 'card-base hover-gradient-cyan-magenta'}  text-main p-3`}
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
            className='object-contain z-0 rounded-2xl'
          />
        </div>
      </Link>

      {/* name */}
      <section className='w-full'>
        <div className='flex justify-between items-center pb-2'>
          <p className='bg-muted/30 rounded-full px-2 py-1'>{product.category}</p>
          <h1 className='flex items-center text-lg font-bold'>
            <BsCurrencyDollar />
            {product.price}
          </h1>
        </div>
        <div className='w-full flex justify-between items-center'>
          <Link
            href={`/product/slug/${product.slug}`}
            className='font-inter font-bold text-lg text-nowrap truncate hover:text-muted'
          >
            {product.name}
          </Link>
        </div>
      </section>

      <section className='w-full'>
        <div className='w-full flex justify-between items-center'>
          <Ratings
            totalSold={product.totalSold}
            rating={product.rating}
            numReviews={product.numReviews}
          />
          {product.countInStock! > 0 && (
            <button
              onClick={addToCartHandler}
              type='button'
              className={`rounded-full ${isFavorito ? 'hover:text-accent/70' : 'hover:text-secondary/70'} flex items-center gap-1 relative`}
            >
              <AiOutlineShoppingCart
                size={28}
                className={`${inCart && 'text-secondary'}`}
              />
              {inCart && <span className='  text-xs  font-bold px-1 lg:px-1.5 py-0.5 rounded-full h-fit absolute -top-1 left-4  bg-red-600 text-white'>{inCart.quantity}</span>}
            </button>
          )}
        </div>
      </section>

      {/* Favorite heart */}
      {isFavorito && (
        <div className='absolute top-2 right-2'>
          <FaHeart
            size={24}
            className='text-secondary'
          />
        </div>
      )}

      {/* Out of Stock or Total sold */}
      <div className='absolute top-2 left-2'>
        {product.countInStock! <= 0 && <div className='rounded-2xl bg-secondary/80 py-1 px-2 w-fit font-bold text-nowrap text-xs  md:text-sm'>Out of Stock</div>}
      </div>
    </div>
  )
}

export default ProductCard
