import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { productApi } from '@/lib/modules/productsApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IFavorite, IProduct } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import AutoSwiper from './AutoSwiper'
import { SwiperSlide } from 'swiper/react'
import ProductCard from './ProductCard'
import { AiFillExclamationCircle } from 'react-icons/ai'

const FavoriteSlide = () => {
  const dispatch = useAppDispatch()
  const [products, setProducts] = useState<IProduct[]>([])
  const { favoriteList } = useAppSelector(state => state.favoriteList)

  useEffect(() => {
    const getProducts = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await productApi.getList()
      if (res.status || error) {
        dispatch(setGlobalLoading(false))
        return
      }
      if (res) {
        setProducts(favoriteList.map((favorites: IFavorite) => res.find((product: IProduct) => product._id === favorites.product)))
      }
      dispatch(setGlobalLoading(false))
    }
    getProducts()
  }, [dispatch, favoriteList])

  if (products.length <= 0)
    return (
      <div className='w-fit flex justify-start items-center gap-4 rounded-xl bg-red-200 p-6'>
        <AiFillExclamationCircle
          size={32}
          color='red'
        />
        <p className='text-2xl text-red-700'>No products added to favorites yet!</p>
      </div>
    )

  return (
    <AutoSwiper slideNumber={products.length}>
      {products.slice(0, 8).map((product, index) => (
        <SwiperSlide
          key={index}
          className='swiper-slide w-fit'
        >
          <ProductCard product={product} />
        </SwiperSlide>
      ))}
    </AutoSwiper>
  )
}

export default FavoriteSlide
