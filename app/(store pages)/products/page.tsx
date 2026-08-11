'use client'

import ProductFilters from '@/components/ProductFilters'
import ProductGrid from '@/components/ProductGrid'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

const ProductsList = () => {
  const router = useRouter()
  const [filter, setFilter] = useState('All products')
  const [priceFilter, setPriceFilter] = useState([0, 1000])
  const [priceSort, setPriceSort] = useState('')

  return (
    <div className='grid grid-cols-4 xl:grid-cols-5 w-[95%] lg:w-[90%] mx-auto gap-8 py-4'>
      <ProductFilters
        filter={filter}
        setFilter={setFilter}
        priceSort={priceSort}
        setPriceSort={setPriceSort}
        setPriceFilter={setPriceFilter}
        clearQuery={() => router.push('/products')}
      />
      <ProductGrid
        filter={filter}
        priceFilter={priceFilter}
        priceSort={priceSort}
      />
    </div>
  )
}

export default ProductsList
