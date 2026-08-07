import { ProductCategory } from '@/lib/constants'
import { useState } from 'react'
import { BiCategory } from 'react-icons/bi'
import { BsSuitDiamond, BsSuitDiamondFill } from 'react-icons/bs'
import { CiCircleChevDown } from 'react-icons/ci'

interface CategoriesBoxProps {
  filter: string
  setFilter: (value: string) => void
}

const CategoriesBox = ({ filter, setFilter }: CategoriesBoxProps) => {
  const [openCategories, setOpenCategories] = useState(false)
  const categories = Object.values(ProductCategory)

  const handleCategorySelect = (nextFilter: string) => {
    setFilter(nextFilter)
  }

  return (
    <div className='flex flex-col h-fit items-center capitalize group card-gradient-featured'>
      <section
        onClick={() => setOpenCategories(!openCategories)}
        className='w-full flex items-center justify-between cursor-pointer px-2'
      >
        <div className='p-2 rounded-2xl w-fit  text-main group-hover:text-primary '>
          <BiCategory size={28} />
        </div>
        <p className='text-main font-bold text-xl group-hover:bg-linear-to-r group-hover:from-primary group-hover:via-tertiary  group-hover:to-accent group-hover:bg-clip-text group-hover:text-transparent'>
          Categories
        </p>
        <div className={`p-2 rounded-2xl w-fit  text-main group-hover:text-accent ${openCategories && 'rotate-180'} transition-all ease-in-out duration-300`}>
          <CiCircleChevDown size={28} />
        </div>
      </section>
      {openCategories && (
        <div className='pb-4 px-1 w-full '>
          <ul>
            <li
              onClick={() => handleCategorySelect('All products')}
              className='hover:bg-muted/30 hover:font-bold  rounded-2xl py-1 px-2 uppercase flex items-center gap-2 '
            >
              {filter === 'All products' ? (
                <BsSuitDiamondFill
                  className='text-primary'
                  size={16}
                />
              ) : (
                <BsSuitDiamond size={16} />
              )}
              <p className='text-main'>all products</p>
            </li>
            {categories.map((cat, index) => (
              <li
                key={index}
                onClick={() => handleCategorySelect(cat)}
                className='hover:bg-muted/30 rounded-2xl py-1 px-2  hover:font-bold  uppercase flex items-center gap-2'
              >
                {filter === cat ? (
                  <BsSuitDiamondFill
                    className='text-primary'
                    size={16}
                  />
                ) : (
                  <BsSuitDiamond size={16} />
                )}
                <p className='text-main'> {cat.toUpperCase()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default CategoriesBox
