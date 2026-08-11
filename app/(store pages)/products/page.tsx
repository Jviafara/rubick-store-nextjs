'use client'

import ProductFilters from '@/components/ProductFilters'
import ProductGrid from '@/components/ProductGrid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ProductsList = () => {
  const router = useRouter()
  const [filter, setFilter] = useState('All products')
  const [priceFilter, setPriceFilter] = useState([0, 1000])
  const [sortBy, setSortBy] = useState('')

  return (
    <div className='grid lg:grid-cols-6 xl:grid-cols-4 w-[95%] lg:w-[90%] mx-auto gap-8 py-4'>
      <ProductFilters
        filter={filter}
        setFilter={setFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        setPriceFilter={setPriceFilter}
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
