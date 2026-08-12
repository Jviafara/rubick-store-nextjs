'use client'

import ProductFilters from '@/components/ProductFilters'
import ProductGrid from '@/components/ProductGrid'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

const ProductsList = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [filter, setFilter] = useState('All products')
  const [priceFilter, setPriceFilter] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('')

  const resetToFirstPage = () => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', '1')
    router.push(`?${params.toString()}`)
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
  )
}

export default ProductsList
