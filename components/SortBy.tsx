import { SortByEnum } from '@/lib/constants'
import { useState } from 'react'
import { BsSuitDiamond, BsSuitDiamondFill } from 'react-icons/bs'
import { CiCircleChevDown } from 'react-icons/ci'
import { MdSortByAlpha } from 'react-icons/md'

interface SortByProps {
  sortBy: string
  setSortBy: (value: string) => void
}

const SortBy = ({ sortBy, setSortBy }: SortByProps) => {
  const [openSortBy, setOpenSortBy] = useState(false)
  const options = Object.values(SortByEnum)

  const handleSortOptSelect = (sortOpt: string) => {
    setSortBy(sortOpt)
  }
  return (
    <div className='flex flex-col h-fit items-center text-nowrap capitalize group card-gradient-cyan-magenta'>
      <section
        onClick={() => setOpenSortBy(!openSortBy)}
        className='w-full flex items-center justify-between cursor-pointer px-2'
      >
        <div className='p-2 rounded-2xl w-fit  text-main group-hover:text-primary '>
          <MdSortByAlpha size={28} />
        </div>
        <p className='text-main font-bold text-xl group-hover:bg-linear-to-r group-hover:from-primary   group-hover:to-secondary group-hover:bg-clip-text group-hover:text-transparent'>
          Sort By
        </p>
        <div
          className={`p-2 rounded-2xl w-fit  text-main group-hover:text-secondary ${openSortBy && 'rotate-180'} transition-all ease-in-out duration-300 `}
        >
          <CiCircleChevDown size={28} />
        </div>
      </section>
      {openSortBy && (
        <div className='pb-4 px-1 w-full '>
          <ul>
            {options.map((opt, index) => (
              <li
                key={index}
                onClick={() => handleSortOptSelect(opt)}
                className='hover:bg-muted/30 rounded-2xl py-1 px-2  hover:font-bold  uppercase flex items-center gap-2'
              >
                {sortBy === opt ? (
                  <BsSuitDiamondFill
                    className='text-primary'
                    size={16}
                  />
                ) : (
                  <BsSuitDiamond size={16} />
                )}
                <p className='text-main'> {opt.toUpperCase()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SortBy
