'use client'

import ImageSlide from '@/components/ImageSlide'
import { useSession } from '@/lib/auth/auth-client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import favoriteApi from '@/lib/modules/favoriteApiClient'
import { productApi } from '@/lib/modules/productsApiClient'
import { addcartItem } from '@/lib/redux/features/cartSlice'
import { addFavorite, removeFavorite } from '@/lib/redux/features/favoriteSlice'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { ICartItem, IFavorite, IProduct } from '@/lib/types'
import Link from 'next/link'
import { notFound, useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { CiDeliveryTruck } from 'react-icons/ci'
import { FaChevronLeft, FaDollarSign, FaMinus, FaPlus, FaStar } from 'react-icons/fa'
import { HiShoppingCart } from 'react-icons/hi'
import { MdSettingsBackupRestore } from 'react-icons/md'
import { RiSecurePaymentFill } from 'react-icons/ri'
import { toast } from 'react-toastify'

const ProductDetail = () => {
  const { data: session } = useSession()
  const params = useParams<{ all?: string[] }>()
  const slug = params.all?.[1]
  const router = useRouter()

  const dispatch = useAppDispatch()
  const { favoriteList } = useAppSelector(state => state.favoriteList)
  const { cartItems } = useAppSelector(state => state.cart)
  const [alreadyInCart, setAlreadyInCart] = useState(false)
  const [product, setProduct] = useState<IProduct>()
  const isFavorite = Boolean(product?._id && favoriteList.some((item: IFavorite) => item.product === product._id))
  const [quantity, setQuantity] = useState(1)
  const [productLoaded, setProductLoaded] = useState(false)

  useEffect(() => {
    const CheckCartItems = async (item: ICartItem) => {
      const inCart = cartItems.find(p => p._id === item._id)
      if (inCart) setAlreadyInCart(true)
    }
    const getProduct = async () => {
      const { res, error } = await productApi.productInfo(slug?.toLocaleString() || '')

      if (res.status || error) {
        toast.error(res.message)
        return
      }
      if (res) {
        setProduct(res)
        CheckCartItems(res)
      }
    }
    getProduct()
  }, [slug, cartItems])

  useEffect(() => {
    const getProduct = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await productApi.productInfo(slug?.toLocaleString() || ' ')

      if (res.status || error) {
        toast.error(res.message)
        setProductLoaded(true)
        dispatch(setGlobalLoading(false))
        return
      }
      if (res) {
        setProduct(res)
      }

      setProductLoaded(true)
      dispatch(setGlobalLoading(false))
    }
    getProduct()
  }, [dispatch, slug])

  const addToCartHandler = async () => {
    const existItem = cartItems?.find(x => x._id === product!._id)
    const cartQuantity = existItem ? existItem.quantity + quantity : quantity

    if (product!.countInStock! < cartQuantity) {
      toast.error('The items in your cart and these many more are more than we have on stock!')
      return
    }

    dispatch(addcartItem({ ...product, quantity: cartQuantity }))
  }

  const onFavoriteClick = async () => {
    if (!session?.user) return router.push('/sign-in')
    if (isFavorite) {
      onRemoveFavorite()
      return
    }

    const { res, err } = await favoriteApi.add(product!._id.toString())

    if (res.status || err) {
      toast.error(res.message)
      return
    }
    if (res) {
      dispatch(addFavorite(res))
      toast.success('Product added to favorites')
    }
  }

  const onRemoveFavorite = async () => {
    const favorite = favoriteList.find(item => item.product === product!._id)

    if (!favorite) {
      return
    }

    const { res, err } = await favoriteApi.remove(favorite._id.toString())

    if (res.status || err) {
      toast.error(res.message)
      return
    }
    if (res) {
      dispatch(removeFavorite(product?._id))
      toast.success('Product remove from favorites')
    }
  }

  function preventEraseLast(event: React.KeyboardEvent<HTMLInputElement>) {
    const input = event.currentTarget

    if ((event.key === 'Backspace' || event.key === 'Delete') && input.value.length <= 1) {
      event.preventDefault()
    }
  }

  const increment = () => {
    if (quantity >= product!.countInStock!) {
      toast.error(`Only ${product!.countInStock} in stock!`)
      return
    }
    setQuantity(prev => prev + 1)
  }

  const decrement = () => {
    if (quantity <= 1) {
      toast.error('Should have at least 1 product!')
      return
    }
    setQuantity(prev => prev - 1)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value)
    if (quantity < 1) {
      toast.error('Should have at least 1 product!')
      setQuantity(prev => prev)
      return
    }
    if (quantity > product!.countInStock!) {
      toast.error(`Only ${product!.countInStock} in stock!`)
      setQuantity(prev => prev)
      return
    }
    setQuantity(quantity)
  }

  if (!product && productLoaded) {
    notFound()
  }

  if (!product) return null

  return (
    <main className='w-[95vw] md:max-w-[90vw] lg:w-[80vw] mx-auto  flex flex-col gap-8 p-4 items-center'>
      <div className='w-full'>
        <Link
          href={`/products`}
          className='font-plus-jakarta-sans text-lg flex gap-2 items-center text-muted'
        >
          <FaChevronLeft />
          <p>Back to products</p>
        </Link>
      </div>
      <div className='w-full flex flex-col lg:flex-row justify-between gap-8 '>
        {/* Images Section */}
        <section className='w-full h-fit grow lg:max-w-2/3 xl:max-w-[70%] bg-surface/70 rounded-2xl p-4'>
          <ImageSlide images={product.images || []} />
        </section>
        <section
          className={`flex flex-col w-full h-fit shrink lg:max-w-1/3 xl:max-w-[30%] space-y-4 px-4 py-8  ${alreadyInCart ? 'card-gradient-cyan-magenta' : 'card-gradient-emerald-cyan'} ${isFavorite && 'card-gradient-featured'}`}
        >
          <div className='w-full flex justify-between'>
            <h1 className='text-2xl'>{product.name}</h1>
            <button
              type='button'
              onClick={onFavoriteClick}
            >
              {isFavorite ? (
                <AiFillHeart
                  size={32}
                  color='red'
                />
              ) : (
                <AiFillHeart
                  size={32}
                  color='gray'
                />
              )}
            </button>
          </div>
          <div className='flex gap-4 items-center'>
            <div className='text-accent text-lg flex gap-2'>
              <FaStar size={24} />
              <p>{product.rating}</p>
            </div>
            <p className='text-muted text-xl'>/</p>
            {(product.totalSold || 0) > 0 && <p className='text-lg text-left'>{product.totalSold} sold</p>}
          </div>

          <div className='flex items-center'>
            <FaDollarSign size={32} />
            <p className='text-4xl'>{product.price}</p>
          </div>

          <p className='text-muted text-sm'>{product.description}</p>

          {(product.countInStock || 0) > 0 ? (
            <div className='flex gap-2 bg-tertiary/20 items-center px-4 py-2 w-fit rounded-2xl uppercase font-bold'>
              <div className='w-4 h-4 rounded-full bg-tertiary border-tertiary'></div>
              <p className='text-tertiary'>In Stock</p>
            </div>
          ) : (
            <div className='flex gap-2 bg-secondary/20 items-center px-4 py-2 w-fit rounded-2xl uppercase'>
              <div className='w-4 h-4 rounded-full bg-secondary border-secondary'></div>
              <p className='text-secondary'>out of stock</p>
            </div>
          )}

          {(product.countInStock || 0) > 0 && (
            <div className='w-full flex flex-col gap-4 items-center justify-center'>
              <div className='w-full flex flex-col md:flex-row gap-4 md:items-center justify-center md:justify-start '>
                <p className='w-fit text-left text-lg'>Quantity:</p>
                <div className='flex items-center justify-center md:justify-start md:w-1/2 text-center'>
                  <button
                    onClick={decrement}
                    className='bg-background h-8 w-8 rounded-l-sm flex items-center justify-center'
                  >
                    <FaMinus size={16} />
                  </button>
                  <input
                    type='number'
                    value={quantity}
                    onChange={handleQuantityChange}
                    onKeyDown={e => preventEraseLast(e)}
                    min={1}
                    className='w-[20%] max-w-20 h-8 bg-background/70 text-center! focus:outline-0 focus:border focus:border-primary. [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                  />
                  <button
                    onClick={increment}
                    className='bg-background h-8 w-8 rounded-r-sm flex items-center justify-center'
                  >
                    <FaPlus size={16} />
                  </button>
                </div>
              </div>
              {alreadyInCart ? (
                <div className='w-fit py-1 px-2 text-white font-plus-jakarta-sans text-center rounded-2xl bg-secondary/70'>
                  Already in Cart!
                </div>
              ) : (
                <button
                  onClick={addToCartHandler}
                  type='button'
                  className='gradient-button text-lg!'
                >
                  Add to Cart
                  <HiShoppingCart size={24} />
                </button>
              )}
            </div>
          )}
          <div className='text-muted text-sm flex flex-col gap-2'>
            <p className='flex gap-2 items-center'>
              <CiDeliveryTruck
                size={24}
                className='text-tertiary'
              />
              Free shipping on orders over $100.
            </p>
            <p className='flex gap-2 items-center'>
              <MdSettingsBackupRestore
                size={24}
                className='text-tertiary'
              />
              30 Days return and refund garantee.
            </p>
            <p className='flex gap-2 items-center'>
              <RiSecurePaymentFill
                size={24}
                className='text-tertiary'
              />
              Secure payment & checkout
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}

export default ProductDetail
