'use client'

import ImageSlide from '@/components/ImageSlide'
import { useSession } from '@/lib/auth/auth-client'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import favoriteApi from '@/lib/modules/favoriteApiClient'
import { productApi } from '@/lib/modules/productsApiClient'
import { addcartItem } from '@/lib/redux/features/cartSlice'
import { addFavorite, removeFavorite } from '@/lib/redux/features/favoriteSlice'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IFavorite, IProduct } from '@/lib/types'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { AiFillHeart } from 'react-icons/ai'
import { toast } from 'react-toastify'

const ProductDetail = () => {
  const { data: session } = useSession()
  const params = useParams<{ all?: string[] }>()
  const slug = params.all?.[1]
  const router = useRouter()

  const dispatch = useAppDispatch()
  const { favoriteList } = useAppSelector(state => state.favoriteList)
  const { cartItems } = useAppSelector(state => state.cart)
  const [isFavorite, setIsFavorite] = useState(false)
  const [product, setProduct] = useState<IProduct>()

  useEffect(() => {
    const setFavorite = () => {
      const fav = favoriteList.find((item: IFavorite) => item.product === product?._id)
      if (fav) setIsFavorite(true)
    }
    setFavorite()
  }, [favoriteList, product])

  useEffect(() => {
    const getProduct = async () => {
      const { res, error } = await productApi.productInfo(slug || '')
      if (res) {
        setProduct(res)
      }
      if (error) toast.error(error.toString())
    }
    getProduct()
  }, [slug])

  useEffect(() => {
    const getProduct = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await productApi.productInfo(slug?.toLocaleString() || ' ')

      if (res) {
        setProduct(res)
      }
      if (error) toast.error(error.toString())
      dispatch(setGlobalLoading(false))
    }
    getProduct()
  }, [dispatch, slug])

  const addToCartHandler = async () => {
    const existItem = cartItems?.find(x => x._id === product!._id)
    const quantity = existItem ? existItem.quantity + 1 : 1

    if (product!.countInStock! < quantity) {
      toast.error('Product Out of Stock')
      return
    }

    dispatch(addcartItem({ ...product, quantity }))
  }

  const onFavoriteClick = async () => {
    if (!session?.user) return router.push('/sign-in')
    if (isFavorite) {
      onRemoveFavorite()
      return
    }

    const { res, err } = await favoriteApi.add(product!._id.toString())

    if (err) toast.error(err.toString())
    if (res) {
      dispatch(addFavorite(res))
      setIsFavorite(true)
      toast.success('Product added to favorites')
    }
  }

  const onRemoveFavorite = async () => {
    const favorite = favoriteList.find(item => item.product === product!._id)
    const { res, err } = await favoriteApi.remove(favorite!._id.toString())

    if (err) toast.error(err.toString())
    if (res) {
      dispatch(removeFavorite(product?._id))
      setIsFavorite(false)
      toast.success('Product remove from favorites')
    }
  }
  if (!product) return null

  return (
    <div className='w-[95vw] md:max-w-[90vw] mx-auto  flex flex-col md:flex-row gap-4 p-4 justify-evenly'>
      <div className='md:w-[50vw] lg:w-[45vw] xl:w-[40vw] shadow-lg'>
        <ImageSlide images={product.images || []} />{' '}
      </div>
      <div className='w-full lg:w-[50%] xl:w-[30%]  flex flex-col xl:flex-row xl:justify-center gap-4 shadow-lg rounded-lg border border-yellow h-fit'>
        <ul className='flex flex-col gap-2 p-4 w-full'>
          <li className='flex justify-between'>
            <h1 className='text-lg font-bold'>{product.name}</h1>
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
          </li>
          <hr className='border border-yellow' />
          <li className='my-2'>
            <p>
              <strong>${product.price}</strong>
            </p>
          </li>
          <hr className='border border-yellow' />
          <li className='my-2'>
            <p>{product.description}</p>
          </li>
          <hr className='border border-yellow' />
          <li className='flex gap-8 p-2 lg:px-0'>
            <p>Status:</p>
            {product.countInStock! > 0 ? (
              <p className='rounded-lg bg-green-500 px-4 text-white font-bold text-lg'>In Stock</p>
            ) : (
              <p className='rounded-lg bg-red-500 px-4 text-white font-bold text-lg'>Unavailable</p>
            )}
          </li>
          {product.countInStock! > 0 && (
            <div>
              <hr className='border border-yellow' />
              <li>
                <button
                  onClick={addToCartHandler}
                  type='button'
                  className='w-full md:w-1/2 rounded-lg border hover:bg-blue-500 bg-yellow py-3 px-4
                                        text-white font-bold font-serif text-lg mt-4'
                >
                  Add to Cart
                </button>
              </li>
            </div>
          )}
        </ul>
      </div>
    </div>
  )
}

export default ProductDetail
