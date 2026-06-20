import { ProductFiltersProps } from '@/lib/types'
import { FiFilter } from 'react-icons/fi'
import React, { useState } from 'react'
import { BsCurrencyDollar } from 'react-icons/bs'

const ProductFilters = ({ filter, setFilter, setPriceFilter, priceSort, setPriceSort }: ProductFiltersProps) => {
  const [moreFilters, setMoreFilters] = useState(false)
  const categories = ['2x2', '3x3', '4x4', '5x5', 'nxn', 'mods', 'minx', 'kits']

  const handleAply = () => {
    setPriceFilter([priceMin, priceMax])
    setMoreFilters(!moreFilters)
  }

  const handleClear = () => {
    setPriceFilter([0, 1000])
    setMoreFilters(!moreFilters)
    setPriceSort('default')
  }

  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(1000)

  const selected = 'bg-gray-200'
  return (
    <div className='flex flex-col items-center my-4 gap-4 w-[95vw] md:w-[90vw]'>
      <div className='flex flex-col md:flex-row justify-evenly items-center capitalize'>
        <ul className='flex flex-col gap-4 items-center'>
          <button
            type='button'
            onClick={() => setMoreFilters(!moreFilters)}
            className={`flex gap-1 items-center p-1 rounded-md ${moreFilters && selected} hover:scale-105 hover:font-bold uppercase`}
          >
            <FiFilter />
            More Filters
          </button>
          <div className='hidden md:flex gap-4 items-center justify-center'>
            <li
              onClick={() => setFilter('All products')}
              className={`${filter === 'All products' && selected} hover:bg-gray-200 hover:font-bold rounded-md p-1 uppercase`}
            >
              all products
            </li>
            {categories.map((cat, index) => (
              <li
                key={index}
                onClick={() => setFilter(cat)}
                className={`${filter === cat && selected} hover:bg-gray-200 hover:font-bold rounded-md p-1 `}
              >
                {cat.toUpperCase()}
              </li>
            ))}
          </div>
        </ul>
      </div>
      <div>
        {moreFilters && (
          <div className='flex flex-col items-center gap-2 max-w-[90vw]'>
            <ul className='flex flex-wrap md:hidden gap-2 items-center justify-center mx-2'>
              <li
                onClick={() => setFilter('All products')}
                className={`${filter === 'All products' && selected} hover:bg-gray-200 hover:font-bold rounded-md p-1 uppercase`}
              >
                all products
              </li>
              {categories.map((cat, index) => (
                <li
                  key={index}
                  onClick={() => setFilter(cat)}
                  className={`${filter === cat && selected} hover:bg-gray-200 hover:font-bold rounded-md p-1 `}
                >
                  {cat.toUpperCase()}
                </li>
              ))}
            </ul>
            <div className='w-full flex flex-col md:flex-row gap-4 items-center justify-center'>
              <h1 className='font-bold'>Price:</h1>
              <div className='flex items-center relative'>
                <div className='absolute ml-2 w-10'>
                  <BsCurrencyDollar />
                </div>
                <input
                  placeholder={`Min (Actual:${priceMin})`}
                  type='number'
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceMin(parseInt(e.target.value))}
                  min={0}
                  className='border pl-8 border-gray-400 rounded-lg py-1 px-3'
                />
              </div>
              <div className='flex items-center relative'>
                <div className='absolute ml-2 w-10'>
                  <BsCurrencyDollar />
                </div>
                <input
                  type='number'
                  placeholder={`Max (Actual:${priceMax})`}
                  min={0}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceMax(parseInt(e.target.value))}
                  className='border pl-8 border-gray-400 rounded-lg py-1 px-3'
                />
              </div>
            </div>
            <h1 className='font-bold'>Sort By:</h1>
            <div className='w-full flex flex-col md:flex-row md:items-center justify-center md:-mt-2'>
              <h1>Price:</h1>
              <div className='flex gap-1 p-2 items-center justify-center rounded hover:scale-105'>
                <input
                  id='checkbox-item-1'
                  type='checkbox'
                  value='Lower to Higher'
                  checked={priceSort === 'Lower to Higher'}
                  onChange={e => {
                    setPriceSort(e.target.value)
                  }}
                  className='hidden peer'
                />
                <label
                  htmlFor='checkbox-item-1'
                  className='w-full py-1 px-2 rounded-full text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 peer-checked:bg-gray-200'
                >
                  Lower to Higher
                </label>
              </div>
              <div className='flex gap-2 items-center justify-center p-2 rounded hover:scale-105'>
                <input
                  id='checkbox-item-2'
                  type='checkbox'
                  value='Higher to Lower'
                  checked={priceSort === 'Higher to Lower'}
                  onChange={e => {
                    setPriceSort(e.target.value)
                  }}
                  className='hidden peer'
                />
                <label
                  htmlFor='checkbox-item-2'
                  className='w-full py-1 px-2 rounded-full text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 peer-checked:bg-gray-200'
                >
                  Higher to Lower
                </label>
              </div>
              <div className='flex gap-2 items-center justify-center p-2 rounded hover:scale-105'>
                <input
                  id='checkbox-item-3'
                  type='checkbox'
                  value='Latest'
                  checked={priceSort === 'Latest'}
                  onChange={e => {
                    setPriceSort(e.target.value)
                  }}
                  className='hidden peer'
                />
                <label
                  htmlFor='checkbox-item-3'
                  className='w-full py-1 px-2 rounded-full text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 peer-checked:bg-gray-200'
                >
                  Latest
                </label>
              </div>
              <div className='flex gap-2 items-center justify-center p-2 rounded hover:scale-105'>
                <input
                  id='checkbox-item-4'
                  type='checkbox'
                  value='top_rated'
                  checked={priceSort === 'top_rated'}
                  onChange={e => {
                    setPriceSort(e.target.value)
                  }}
                  className='hidden peer'
                />
                <label
                  htmlFor='checkbox-item-4'
                  className='w-full py-1 px-2 rounded-full text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-200 peer-checked:bg-gray-200'
                >
                  Top rated
                </label>
              </div>
            </div>
            <div className='flex gap-4'>
              <button
                type='button'
                onClick={handleAply}
                className='flex gap-1 items-center p-1 rounded-md bg-gray-200 hover:scale-105 hover:font-bold'
              >
                <FiFilter />
                Apply
              </button>
              <button
                type='button'
                onClick={handleClear}
                className='flex gap-1 items-center p-1 rounded-md bg-red-400 hover:scale-105 hover:font-bold'
              >
                <FiFilter />
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductFilters
