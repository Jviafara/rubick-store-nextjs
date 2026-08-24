import React, { useEffect, useState } from 'react'
import AutoSwiper from './AutoSwiper'
import { SwiperSlide } from 'swiper/react'
import ProductCard from './ProductCard'
import { AiFillExclamationCircle } from 'react-icons/ai'
import favoriteApi from '@/lib/modules/favoriteApiClient'
import { IProduct } from '@/lib/types'
import { getParamsString } from '@/lib/utils'

const FavoriteSlide = () => {
  const [products, setProducts] = useState<IProduct[]>([])
  const page = '1'
  const pageSize = '8'
  const paramsString = getParamsString({ page, pageSize })

  useEffect(() => {
    const getProducts = async () => {
      const { res, err } = await favoriteApi.getList(paramsString)

      if (res.status || err) {
        return
      }

      if (res) {
        setProducts(res.products)
      }
    }
    getProducts()
  }, [paramsString])

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
    <>
      <AutoSwiper slideNumber={products.length}>
        {products.slice(0, 8).map((product, index) => (
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

export default FavoriteSlide
