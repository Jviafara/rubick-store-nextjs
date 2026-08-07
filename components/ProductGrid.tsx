import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { productApi } from '@/lib/modules/productsApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IProduct, ProductGridProps } from '@/lib/types'
import { getDate } from '@/lib/utils'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ProductCard from './ProductCard'
import ProductNotFound from './ProductNotFound'
import { useSearchParams } from 'next/navigation'

const sortProducts = (products: IProduct[], priceSort: string) => {
  const sortedProducts = [...products]

  if (priceSort === 'Lower to Higher') {
    return sortedProducts.sort((a, b) => a.price! - b.price!)
  }

  if (priceSort === 'Higher to Lower') {
    return sortedProducts.sort((a, b) => b.price! - a.price!)
  }

  if (priceSort === 'Latest') {
    return sortedProducts.sort((a, b) => getDate(a).getTime() - getDate(b).getTime())
  }

  if (priceSort === 'top_rated') {
    return sortedProducts.sort((a, b) => b.rating! - a.rating!)
  }

  return sortedProducts
}

const ProductGrid = ({ filter, priceFilter, priceSort }: ProductGridProps) => {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [products, setProducts] = useState<IProduct[]>([])

  const activeQuery = searchParams.get('query') || ''

  useEffect(() => {
    let isMounted = true

    const getProducts = async () => {
      dispatch(setGlobalLoading(true))

      try {
        const { res, error } = activeQuery ? await productApi.getQueryList(activeQuery) : await productApi.getList()

        if (error) {
          throw new Error(error.toString())
        }

        const fetchedProducts = Array.isArray(res) ? res : (res?.products ?? [])

        if (res?.status) {
          if (isMounted) {
            setProducts([])
          }
          return
        }

        if (isMounted) {
          setProducts(sortProducts(fetchedProducts, priceSort))
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : 'Something went wrong while loading products')
          setProducts([])
        }
      } finally {
        if (isMounted) {
          dispatch(setGlobalLoading(false))
        }
      }
    }

    getProducts()

    return () => {
      isMounted = false
    }
  }, [activeQuery, dispatch, priceSort])

  return (
    <div className='w-[95vw] md:w-[90vw] flex flex-col items-center pb-12'>
      <p className='my-2'>
        {'Category: ' +
          filter.toUpperCase() +
          ' / Min Price: ' +
          priceFilter[0] +
          ' / Max Price: ' +
          priceFilter[1] +
          ' / Sort: ' +
          priceSort.toUpperCase()}
      </p>
      {filter !== 'All products' &&
        products
          ?.filter(product => product.category === filter)
          ?.filter(product => product.price! >= priceFilter[0] && product.price! <= priceFilter[1]).length <= 0 && (
          <ProductNotFound />
        )}
      {filter === 'All products' &&
        products?.filter(product => product.price! >= priceFilter[0] && product.price! <= priceFilter[1])?.length <=
          0 && <ProductNotFound />}
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
