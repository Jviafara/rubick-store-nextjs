'use client'

import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { productApi } from '@/lib/modules/productsApiClient'
import { IProduct, ProductSlideProps } from '@/lib/types'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import AutoSwiper from './AutoSwiper'
import { SwiperSlide } from 'swiper/react'
import { getDate } from '@/lib/utils'
import ProductCard from './ProductCard'

const ProductSlide = ({ slideType }: ProductSlideProps) => {
  const dispatch = useAppDispatch()

  const [products, setProducts] = useState<IProduct[]>([])

  useEffect(() => {
    const getProducts = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await productApi.getList()
      if (error) toast.error(String(error))
      if (res.status >= 400) {
        toast.error(res.message)
      } else if (res) {
        setProducts(res)
        dispatch(setGlobalLoading(false))
      }
    }
    getProducts()
  }, [dispatch])

  return (
    <>
      <AutoSwiper>
        {slideType === 'latest' &&
          products
            .sort((a, b) => getDate(b).getTime() - getDate(a).getTime())
            .slice(0, 8)
            .map((product, index) => (
              <SwiperSlide
                key={index}
                className='swiper-slide w-fit'
              >
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
        {slideType === 'top_rated' &&
          products
            .sort((a, b) => (b.rating || 0) - (a.rating || 0))
            .slice(0, 8)
            .map((product, index) => (
              <SwiperSlide
                key={index}
                className='swiper-slide w-full '
              >
                <ProductCard product={product} />
              </SwiperSlide>
            ))}
      </AutoSwiper>
    </>
  )
}

export default ProductSlide
