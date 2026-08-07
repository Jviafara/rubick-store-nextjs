import { ProductFiltersProps } from '@/lib/types'
import { useState } from 'react'
import CategoriesBox from './CategoriesBox'
import PriceBox from './PriceBox'
import { MdFilterAltOff } from 'react-icons/md'
import SortBy from './SortBy'

const ProductFilters = ({ filter, setFilter, setPriceFilter, sortBy, setSortBy, clearQuery }: ProductFiltersProps) => {
  const [moreFilters, setMoreFilters] = useState(false)

  const handleClear = () => {
    setPriceFilter([0, Infinity])
    setFilter('All products')
    setSortBy('')
    clearQuery()
    setMoreFilters(!moreFilters)
  }

  return (
    <section className='lg:col-span-2 xl:col-span-1 w-full max-w-[95vw] max-h-fit bg-surface py-4 px-2 md:px-4 2xl:px-8 rounded-2xl  overflow-hidden flex flex-col space-y-4'>
      <div className='w-full flex flex-col md:flex-row lg:flex-col justify-evenly gap-4'>
        <CategoriesBox
          filter={filter}
          setFilter={setFilter}
        />
        <PriceBox setPriceFilter={setPriceFilter} />
        <SortBy
          sortBy={sortBy}
          setSortBy={setSortBy}
        />
      </div>
      <div className='w-full flex justify-center'>
        <button
          onClick={() => handleClear()}
          className='flex gap-2 items-center border border-red-500 w-fit px-4 py-2 text-lg font-semibold rounded-full hover:text-red-500'
        >
          <MdFilterAltOff />
          Clear All
        </button>
      </div>
    </section>
  )
}

export default ProductFilters
