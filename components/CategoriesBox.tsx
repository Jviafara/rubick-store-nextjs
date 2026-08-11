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
  const categories = ['2x2', '3x3', '4x4', '5x5', 'nxn', 'mods', 'minx', 'kits']

  const handleCategorySelect = (nextFilter: string) => {
    setFilter(nextFilter)
  }

  return (
    <div className='flex flex-col items-center capitalize group card-gradient-cyan-magenta'>
      <section
        onClick={() => setOpenCategories(!openCategories)}
        className='w-full flex items-center justify-between cursor-pointer px-2'
      >
        <div className='p-2 rounded-2xl w-fit  text-main group-hover:text-primary hidden 2xl:block'>
          <BiCategory size={28} />
        </div>
        <p className='text-main font-bold text-xl group-hover:bg-linear-to-r group-hover:from-primary group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent'>
          Categories
        </p>
        <div
          className={`p-2 rounded-2xl w-fit  text-main group-hover:text-secondary ${openCategories && 'rotate-180'} transition-all ease-in-out duration-300 hidden lg:block`}
        >
          <CiCircleChevDown size={28} />
        </div>
      </section>
      {openCategories && (
        <div className='pb-4'>
          <ul>
            <li
              onClick={() => handleCategorySelect('All products')}
              className='hover:bg-surface/70 hover:font-bold  uppercase flex items-center gap-2 '
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
                className='hover:bg-surface/70 hover:font-bold  uppercase flex items-center gap-2'
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
