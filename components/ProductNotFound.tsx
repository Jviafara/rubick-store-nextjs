import React from 'react'
import { AiFillExclamationCircle } from 'react-icons/ai'

const ProductNotFound = () => {
  return (
    <div className='w-full lg:w-[70%] flex items-center justify-center gap-4 rounded-xl bg-red-200 p-6'>
      <AiFillExclamationCircle
        size={32}
        color='red'
      />
      <p className='text-2xl text-center flex justify-center text-red-700'>Product Not Found</p>
    </div>
  )
}

export default ProductNotFound
