'use client'

import ProductFilters from '@/components/ProductFilters'
import ProductGrid from '@/components/ProductGrid'
import { useRouter } from 'next/navigation'
import { Suspense, useState } from 'react'

const ProductsList = () => {
  const router = useRouter()
  const [filter, setFilter] = useState('All products')
  const [priceFilter, setPriceFilter] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('')

  const resetToFirstPage = () => {
    router.push('/products?page=1')
  }

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
    <Suspense fallback={null}>
      <div className='grid lg:grid-cols-6 xl:grid-cols-4 w-[95%] lg:w-[90%] mx-auto gap-8 py-4'>
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
    </Suspense>
  )
}

export default ProductsList
