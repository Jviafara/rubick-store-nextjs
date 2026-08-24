'use client'

import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { productApi } from '@/lib/modules/productsApiClient'
import { IProduct, ProductSlideProps } from '@/lib/types'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import AutoSwiper from './AutoSwiper'
import { SwiperSlide } from 'swiper/react'
import { getParamsString } from '@/lib/utils'
import ProductCard from './ProductCard'

const ProductSlide = ({ slideType }: ProductSlideProps) => {
  const dispatch = useAppDispatch()
  const sortBy = slideType

  const [products, setProducts] = useState<IProduct[]>([])
  const paramsString = getParamsString({ query: '', page: '1', pageSize: '8', sortBy })

  useEffect(() => {
    const getProducts = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await productApi.getList(paramsString)
      if (error) toast.error(String(error))
      if (res.status >= 400) {
        toast.error(res.message)
      } else if (res) {
        setProducts(res.products ? res.products : res)
        dispatch(setGlobalLoading(false))
      }
    }
    getProducts()
  }, [dispatch, paramsString])

  if (!products) return null

  return (
    <>
      <AutoSwiper slideNumber={products.length}>
        {products &&
          products.map((product, index) => (
            <SwiperSlide
              key={index}
              className='swiper-slide w-fit overflow-x-visible'
            >
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
      </AutoSwiper>
    </>
  )
}

export default ProductSlide
