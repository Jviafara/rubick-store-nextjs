'use client'

import { useAppDispatch } from '@/lib/hooks/redux.hooks'
import { productApi } from '@/lib/modules/productsApiClient'
import { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import { IPagination, IProduct, ProductGridProps } from '@/lib/types'
import { getParamsString } from '@/lib/utils'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import ProductCard from './ProductCard'
import ProductNotFound from './ProductNotFound'
import { useSearchParams } from 'next/navigation'
import { useRouter } from 'next/navigation'

const ProductGrid = ({ filter, priceFilter, sortBy }: ProductGridProps) => {
  const searchParams = useSearchParams()
  const dispatch = useAppDispatch()
  const [products, setProducts] = useState<IProduct[]>([])
  const [pagination, setPagination] = useState<IPagination | null>(null)

  const activeQuery = searchParams.get('query') || ''
  const page = searchParams.get('page') || '1'
  const pageSize = searchParams.get('page_size') || '24'

  const paramsString = getParamsString({ query: activeQuery, page, pageSize, filter, priceFilter, sortBy })
  const router = useRouter()

  const handlePageChange = (pageNumber: number) => {
    try {
      const params = new URLSearchParams(searchParams.toString())
      params.set('page', String(pageNumber))
      router.push(`?${params.toString()}`)
    } catch (e) {
      if (e) toast.error('Redirecing')
      router.push(getParamsString({ query: activeQuery, page, pageSize, filter, priceFilter, sortBy }))
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

  useEffect(() => {
    let isMounted = true

    const getProducts = async () => {
      dispatch(setGlobalLoading(true))

      try {
        const { res, error } = await productApi.getList(paramsString)

        const fetchedProducts = Array.isArray(res) ? res : (res?.products ?? [])
        const fetchedPagination = res.pagination

        if (res?.status || error) {
          if (isMounted) {
            setProducts([])
            toast.error(res.message)
          }
          return
        }

        if (isMounted) {
          setProducts(fetchedProducts)
          setPagination(fetchedPagination)
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
  }, [activeQuery, dispatch, sortBy, paramsString])

  return (
    <div className='w-full flex flex-col items-center pb-12 row-span-1 lg:col-span-4 xl:col-span-3 overflow-y-visible'>
      {products.length <= 0 && <ProductNotFound />}
      <div className='w-full grid gap-4 xl:gap-8  grid-cols-1  md:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-6  place-items-center justify-center md:justify-stretch'>
        {products.length > 0 &&
          products.map(product => (
            <ProductCard
              key={product._id.toString()}
              product={product}
            />
          ))}
      </div>
      {/* Pagination controls */}
      {pagination && pagination.totalPages > 1 && products.length > 0 && (
        <div className='w-fit max-w-[80vw] mt-8 flex items-center justify-center flex-wrap gap-2'>
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

export default ProductGrid
