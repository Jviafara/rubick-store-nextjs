import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { productApi } from '@/lib/modules/productsApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IFavorite, IProduct } from '@/lib/types'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import AutoSwiper from './AutoSwiper'
import { SwiperSlide } from 'swiper/react'
import ProductCard from './ProductCard'

const FavoriteSlide = () => {
  const dispatch = useAppDispatch()
  const [products, setProducts] = useState<IProduct[]>([])
  const { favoriteList } = useAppSelector(state => state.favoriteList)

  useEffect(() => {
    const getProducts = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await productApi.getList()
      if (res) {
        setProducts(favoriteList.map((favorites: IFavorite) => res.find((product: IProduct) => product._id === favorites.product)))
      }
      if (error) toast.error(error.toString())
      dispatch(setGlobalLoading(false))
    }
    getProducts()
  }, [dispatch, favoriteList])
  return (
    <AutoSwiper>
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
