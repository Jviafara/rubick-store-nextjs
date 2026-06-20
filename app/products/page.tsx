'use client'

import ProductFilters from '@/components/ProductFilters'
import ProductGrid from '@/components/ProductGrid'
import SearchBar from '@/components/SearchBar'
import { useState } from 'react'

const ProductsList = () => {
  const [filter, setFilter] = useState('All products')
  const [query, setQuery] = useState('')
  const [priceFilter, setPriceFilter] = useState([0, 1000])
  const [priceSort, setPriceSort] = useState('')

  return (
    <div className='w-full flex flex-col items-center'>
      <SearchBar setQuery={setQuery} />
      <ProductFilters
        filter={filter}
        setFilter={setFilter}
        priceSort={priceSort}
        setPriceSort={setPriceSort}
        setPriceFilter={setPriceFilter}
      />
      <ProductGrid
        query={query}
        filter={filter}
        priceFilter={priceFilter}
        priceSort={priceSort}
      />
    </div>
  )
}

export default ProductsList
