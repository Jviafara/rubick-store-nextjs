import { CiSearch } from 'react-icons/ci'
import SearchBar from './SearchBar'
import { SortByEnum, userSortBy } from '@/lib/constants'
import { useEffect, useState } from 'react'
import ProductsTable from './ProductsTable'
import { useRouter, useSearchParams } from 'next/navigation'

const ProductList = () => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filter, setFilter] = useState('All products')
  const [priceFilter, setPriceFilter] = useState([0, 1000])
  const options = Object.values(SortByEnum)

  useEffect(() => {
    const getSortByParams = () => {
      const sortParam = searchParams.get('sort_by')

      if (sortParam) setSortBy(sortParam)
    }
    getSortByParams()
  }, [searchParams, setSortBy])

  const resetToFirstPage = () => {
    router.push('/products?page=1')
  }

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value as userSortBy)
  }

  return (
    <div className='w-full h-full flex flex-col gap-4 items-baseline bg-surface p-4 rounded-2xl'>
      <section className='w-full'>
        <h1 className='font-bold text-center uppercase text-xl'>Product List</h1>
      </section>
      <section className='w-full flex items-center  space-x-8'>
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
            {options.map(sort => (
              <option
                key={sort}
                value={sort}
              >
                {sort}
              </option>
            ))}
          </select>
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
