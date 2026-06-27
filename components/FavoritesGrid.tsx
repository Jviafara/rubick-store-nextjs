'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { productApi } from '@/lib/modules/productsApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IProduct } from '@/lib/types'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ProductNotFound from './ProductNotFound'
import ProductCard from './ProductCard'

const FavoritesGrid = () => {
  const dispatch = useAppDispatch()
  const [products, setProducts] = useState<IProduct[]>([])
  const { favoriteList } = useAppSelector(state => state.favoriteList)

  useEffect(() => {
    const getProducts = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await productApi.getList()
      if (res) {
        setProducts(favoriteList.map(favorites => res.find((product: IProduct) => product._id === favorites.product)))
      }
      if (error) toast.error(error.toString())
      dispatch(setGlobalLoading(false))
    }
    getProducts()
  }, [dispatch, favoriteList])

  return (
    <div className='w-[95vw] md:w-[90vw] flex flex-col items-center mt-8 pb-12'>
      {products.length <= 0 && <ProductNotFound />}
      <div className='w-[80vw] grid gap-8 xl:gap-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center justify-stretch'>
        {products?.map(product => (
          <ProductCard
            key={product._id.toString()}
            product={product}
          />
        ))}
      </div>
    </div>
  )
}

export default FavoritesGrid
