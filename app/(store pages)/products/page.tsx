'use client'

import ProductFilters from '@/components/ProductFilters'
import ProductGrid from '@/components/ProductGrid'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useState } from 'react'

const ProductsListContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filter, setFilter] = useState('All products')
  const [priceFilter, setPriceFilter] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('')

  const resetToFirstPage = () => {
    router.push('/products?page=1')
  }

  useEffect(() => {
    const getSortByParams = () => {
      const sortParam = searchParams.get('sort_by')

      if (sortParam) setSortBy(sortParam)
    }
    getSortByParams()
  }, [searchParams, setSortBy])

  const handleFilterChange = (nextFilter: string) => {
    setFilter(nextFilter)
    resetToFirstPage()
  }

  const handlePriceFilterChange = (nextPriceFilter: number[]) => {
    setPriceFilter(nextPriceFilter)
    resetToFirstPage()
  }

  const handleSortChange = (nextSortBy: string) => {
    setSortBy(nextSortBy)
    resetToFirstPage()
  }

  return (
    <div className='grid lg:grid-cols-6 xl:grid-cols-4 place-items-center md:place-items-start w-[95%] lg:w-[90%] max-w-[100vw] md:mx-auto gap-4 xl:gap-8 py-4'>
      <ProductFilters
        filter={filter}
        setFilter={handleFilterChange}
        sortBy={sortBy}
        setSortBy={handleSortChange}
        setPriceFilter={handlePriceFilterChange}
        clearQuery={() => router.push('/products')}
      />
      <ProductGrid
        filter={filter}
        priceFilter={priceFilter}
        sortBy={sortBy}
      />
    </div>
  )
}

const ProductsList = () => (
  <Suspense fallback={null}>
    <ProductsListContent />
  </Suspense>
)

export default ProductsList
