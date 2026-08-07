'use client'

import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IPagination, IProduct } from '@/lib/types'
import { Suspense, useEffect, useState } from 'react'
import ProductNotFound from './ProductNotFound'
import ProductCard from './ProductCard'
import favoriteApi from '@/lib/modules/favoriteApiClient'
import { getParamsString } from '@/lib/utils'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'react-toastify'

const FavoritesGridContent = () => {
  const dispatch = useAppDispatch()
  const searchParams = useSearchParams()

  const [products, setProducts] = useState<IProduct[]>([])
  const [pagination, setPagination] = useState<IPagination | null>(null)
  const { favoriteList } = useAppSelector(state => state.favoriteList)

  const page = searchParams.get('page') || '1'
  const pageSize = searchParams.get('page_size') || '24'

  const paramsString = getParamsString({ page, pageSize })
  const router = useRouter()

  useEffect(() => {
    let isMounted = true

    const getProducts = async () => {
      dispatch(setGlobalLoading(true))
      try {
        const { res, err } = await favoriteApi.getList(paramsString)
        const fetchedProducts = Array.isArray(res) ? res : (res?.products ?? [])
        const fetchedPagination = res.pagination

        if (res?.status || err) {
          if (isMounted) {
            setProducts([])
          }
          return
        }

        if (isMounted) {
          setProducts(fetchedProducts)
          setPagination(fetchedPagination)
        }
        if (res) {
          setProducts(res.products)
          setPagination(res.pagination)
        }
      } catch (error) {
        if (isMounted) {
          toast.error(error instanceof Error ? error.message : 'Something went wrong while loading products')
          setProducts([])
          setPagination(null)
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
  }, [dispatch, favoriteList, paramsString])

  const handlePageChange = (pageNumber: number) => {
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(pageNumber))
      router.push(`?${params.toString()}`)
    } catch (e) {
      if (e) toast.error('Redirecing')
      router.push(getParamsString({ page, pageSize }))
    }
  }

  const getPageNumbers = (totalPages: number, current: number) => {
    const pages: number[] = []
    const maxButtons = 7
    let start = Math.max(1, current - Math.floor(maxButtons / 2))
    const end = Math.min(totalPages, start + maxButtons - 1)

    if (end - start + 1 < maxButtons) {
      start = Math.max(1, end - maxButtons + 1)
    }

    for (let i = start; i <= end; i++) pages.push(i)
    return pages
  }

  return (
    <div className='w-full  flex flex-col justify-center items-center'>
      {products.length <= 0 && <ProductNotFound />}
      <div className='w-full mb-8'>
        <h1 className='font-bold uppercase text-lg md:txt-xl lg:text-2xl font-inter max-w-fit group'>
          Favorites
          <span
            className='
                  left-0
                  bottom-0
                  block
                  w-2/3
                  h-1.25
                  bg-primary
                  group-hover:w-full
                '
          />
        </h1>
      </div>
      <div className='w-full max-w-[90%] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 justify-items-center gap-8 xl:gap-12 '>
        {products.length > 0 &&
          products?.map(product => (
            <ProductCard
              key={product._id.toString()}
              product={product}
            />
          ))}
      </div>
      {/* Pagination controls */}
      {pagination && pagination.totalPages > 1 && products.length > 0 && (
        <div className='w-[80%] mt-8 flex items-center justify-center flex-wrap gap-2'>
          <button
            onClick={() => handlePageChange(Math.max(1, (pagination.currentPage || 1) - 1))}
            disabled={!pagination.hasPrevPage}
            className={`px-3 py-1 rounded-xl border ${!pagination.hasPrevPage ? 'opacity-40 cursor-not-allowed' : 'hover:bg-muted/30'}`}
          >
            Prev
          </button>

          {getPageNumbers(pagination.totalPages, pagination.currentPage).map(p => (
            <button
              key={p}
              onClick={() => handlePageChange(p)}
              className={`px-3 py-1 rounded-xl border ${p === pagination.currentPage ? 'bg-muted/40 text-white' : 'hover:bg-muted/30'}`}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(Math.min(pagination.totalPages, (pagination.currentPage || 1) + 1))}
            disabled={!pagination.hasNextPage}
            className={`px-3 py-1 rounded-xl border ${!pagination.hasNextPage ? 'opacity-40 cursor-not-allowed' : 'hover:bg-muted/30'}`}
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}

const FavoritesGrid = () => {
  return (
    <Suspense fallback={null}>
      <FavoritesGridContent />
    </Suspense>
  )
}

export default FavoritesGrid
