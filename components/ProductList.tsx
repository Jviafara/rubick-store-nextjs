import { CiSearch } from 'react-icons/ci'
import SearchBar from './SearchBar'
import { ProductCategory, SortByEnum } from '@/lib/constants'
import { useEffect, useState } from 'react'
import ProductsTable from './ProductsTable'
import { useRouter, useSearchParams } from 'next/navigation'
import { GiBroom } from 'react-icons/gi'

const ProductList = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filter, setFilter] = useState('All products')
  const [priceFilter, setPriceFilter] = useState([0, 1000])
  const sortOptions = Object.values(SortByEnum)
  const categories = Object.values(ProductCategory)

  const priceOptions = [
    [0, 10],
    [10, 25],
    [25, 50],
    [50, 100],
    [100, Infinity],
  ]

  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(1000)

  useEffect(() => {
    const getSortByParams = () => {
      const sortParam = searchParams.get('sort_by')

      if (sortParam) setSortBy(sortParam)
    }
    getSortByParams()
  }, [searchParams, setSortBy])

  const resetToFirstPage = () => {
    router.push('?tab=products&page=1')
  }

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value)
    resetToFirstPage()
  }
  const handleFilterChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(event.target.value as ProductCategory)
    resetToFirstPage()
  }

  const handlePriceSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOption = event.target.value
    if (selectedOption === 'All products') {
      handlePriceClear()
      resetToFirstPage()
      return
    }
    const [min, max] = selectedOption.split('-').map(Number)
    handleCategorySelect([min, max])
    resetToFirstPage()
  }

  const handleCategorySelect = (opt: number[]) => {
    setPriceMin(opt[0])
    setPriceMax(opt[1])
    setPriceFilter([opt[0], opt[1]])
  }
  const handlePriceClear = () => {
    setPriceMin(0)
    setPriceMax(Infinity)
    setPriceFilter([0, Infinity])
  }
  const handleFilterClear = () => {
    setSortBy(sortOptions[0])
    setFilter('All products')
    handlePriceClear()
    resetToFirstPage()
  }

  return (
    <div className='w-full h-full flex flex-col gap-4 items-baseline bg-surface px-4 py-8 rounded-2xl'>
      <section className='w-full'>
        <h1 className='font-bold text-center uppercase text-xl'>Product List</h1>
      </section>
      <section className='w-full flex items-center justify-between space-x-8'>
        <div className='flex gap-2 items-center '>
          <CiSearch size={24} />
          <SearchBar
            type='Products'
            query={query}
            setQuery={setQuery}
            handleSearchClick={() => {}}
          />
        </div>
        <div className=' flex items-center space-x-2'>
          <label
            htmlFor='sort-by'
            className='font-semibold mr-2'
          >
            Sort By:
          </label>
          <select
            name='sort-by'
            id='sort-by'
            value={sortBy}
            onChange={handleSortChange}
            className='h-8 border border-muted rounded-xl px-2 py-1 text-main bg-background'
          >
            {sortOptions.map(sort => (
              <option
                key={sort}
                value={sort}
              >
                {sort}
              </option>
            ))}
          </select>
        </div>
        <div className=' flex items-center space-x-2'>
          <label
            htmlFor='categories'
            className='font-semibold mr-2'
          >
            Category:
          </label>
          <select
            name='categories'
            id='categories'
            value={filter}
            onChange={handleFilterChange}
            className='h-8 border border-muted rounded-xl px-2 py-1 text-main bg-background'
          >
            <option value={'All products'}>All</option>
            {categories.map((category, index) => (
              <option
                key={index}
                value={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>
        <div className=' flex items-center space-x-2'>
          <label
            htmlFor='categories'
            className='font-semibold mr-2'
          >
            Price:
          </label>
          <select
            name='price'
            id='price'
            onChange={handlePriceSelect}
            value={`${priceMin}-${priceMax}`}
            className='h-8 border border-muted rounded-xl px-2 py-1 text-main bg-background'
          >
            <option value={'All products'}>All</option>
            {priceOptions.map((option, index) => (
              <option
                key={index}
                value={`${option[0]}-${option[1]}`}
              >
                {option[0] !== 0 ? option[0] : '<'}
                {option[0] > 0 && option[1] < 101 && ' - '}
                {option[1] === Infinity ? '<' : option[1]}
              </option>
            ))}
          </select>
        </div>
        <div className=' flex self-end items-center space-x-2'>
          <button
            onClick={handleFilterClear}
            className='p-4 hover:text-primary hover:scale-110'
          >
            <GiBroom size={24} />
          </button>
        </div>
      </section>
      <ProductsTable
        query={query}
        filter={filter}
        priceFilter={priceFilter}
        sortBy={sortBy}
      />
    </div>
  )
}

export default ProductList
