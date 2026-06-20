import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { productApi } from '@/lib/modules/productsApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IProduct, ProductGridProps } from '@/lib/types'
import { getDate } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ProductCard from './ProductCard'
import ProductNotFound from './ProductNotFound'

const ProductGrid = ({ filter, priceFilter, priceSort, query }: ProductGridProps) => {
  const dispatch = useAppDispatch()
  const [products, setProducts] = useState<IProduct[]>([])

  useEffect(() => {
    const getProducts = async () => {
      const { res, error } = await productApi.getList()
      if (res) {
        if (
          res.filter(
            (product: IProduct) =>
              product.name?.toLowerCase()?.includes(query?.toLowerCase()) ||
              product.category?.toLowerCase()?.includes(query?.toLowerCase()) ||
              product._id?.toString().toLowerCase()?.includes(query?.toLowerCase()),
          ).length <= 0
        )
          toast.error('Product not found')
        setProducts(
          res.filter(
            (product: IProduct) =>
              product.name?.toLowerCase()?.includes(query?.toLowerCase()) ||
              product.category?.toLowerCase()?.includes(query?.toLowerCase()) ||
              product._id?.toString().toLowerCase()?.includes(query?.toLowerCase()),
          ),
        )
      }

      if (error) toast.error(error.toString())
    }
    getProducts()
  }, [query])

  useEffect(() => {
    const getProducts = async () => {
      const { res, error } = await productApi.getList()
      if (res) {
        if (priceSort === 'Lower to Higher') {
          setProducts(res.sort((a: IProduct, b: IProduct) => a.price! - b.price!))
        } else if (priceSort === 'Higher to Lower') {
          setProducts(res.sort((a: IProduct, b: IProduct) => b.price! - a.price!))
        } else if (priceSort === 'Latest') {
          setProducts(res.sort((a: IProduct, b: IProduct) => getDate(b).getTime() - getDate(a).getTime()))
        } else if (priceSort === 'top_rated') {
          setProducts(res.sort((a: IProduct, b: IProduct) => b.rating! - a.rating!))
        } else {
          setProducts(res)
        }
      }
      if (error) toast.error(error.toString())
    }
    getProducts()
  }, [priceSort])

  useEffect(() => {
    const getProducts = async () => {
      dispatch(setGlobalLoading(true))
      const { res, error } = await productApi.getList()
      if (res) {
        setProducts(res)
      }
      if (error) toast.error(error.toString())
      dispatch(setGlobalLoading(false))
    }
    getProducts()
  }, [dispatch])

  return (
    <div className='w-[95vw] md:w-[90vw] flex flex-col items-center pb-12'>
      <p className='my-2'>{'Category: ' + filter.toUpperCase() + ' / Min Price: ' + priceFilter[0] + ' / Max Price: ' + priceFilter[1] + ' / Sort: ' + priceSort.toUpperCase()}</p>
      {filter !== 'All products' &&
        products?.filter(product => product.category === filter)?.filter(product => product.price! >= priceFilter[0] && product.price! <= priceFilter[1]).length <= 0 && (
          <ProductNotFound />
        )}
      {filter === 'All products' && products?.filter(product => product.price! >= priceFilter[0] && product.price! <= priceFilter[1])?.length <= 0 && <ProductNotFound />}
      <div className='w-[80vw] grid gap-8 xl:gap-12 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-items-center justify-stretch'>
        {filter !== 'All products' &&
          products
            ?.filter(product => product.category === filter)
            ?.filter(product => product.price! >= priceFilter[0] && product.price! <= priceFilter[1])
            ?.map(product => (
              <ProductCard
                key={product._id.toString()}
                product={product}
              />
            ))}
        {filter === 'All products' &&
          products
            ?.filter(product => product.price! >= priceFilter[0] && product.price! <= priceFilter[1])
            ?.map(product => (
              <ProductCard
                key={product._id.toString()}
                product={product}
              />
            ))}
      </div>
    </div>
  )
}

export default ProductGrid
