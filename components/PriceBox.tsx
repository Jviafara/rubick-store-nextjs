import { useState } from 'react'
import { BsCurrencyDollar } from 'react-icons/bs'
import { CiCircleChevDown } from 'react-icons/ci'
import { MdOutlinePriceChange } from 'react-icons/md'

interface PriceBoxProps {
  setPriceFilter: (value: number[]) => void
}

const PriceBox = ({ setPriceFilter }: PriceBoxProps) => {
  const [openPrices, setOpenPrices] = useState(false)
  const priceOptions = [
    [0, 10],
    [10, 25],
    [25, 50],
    [50, 100],
    [100, Infinity],
  ]

  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(1000)

  const handleCategorySelect = (opt: number[]) => {
    setPriceMin(opt[0])
    setPriceMax(opt[1])
    setPriceFilter([opt[0], opt[1]])
  }
  const handleClear = () => {
    setPriceMin(0)
    setPriceMax(Infinity)
    setPriceFilter([0, Infinity])
  }

  const selected = 'bg-muted/30 scale-110'
  return (
    <div className='flex flex-col items-center capitalize group card-gradient-emerald-cyan w-full max-w-full h-fit relative '>
      <section
        onClick={() => setOpenPrices(!openPrices)}
        className='w-full flex items-center justify-between cursor-pointer px-2'
      >
        <div className='p-2 rounded-2xl w-fit  text-main group-hover:text-tertiary '>
          <MdOutlinePriceChange size={28} />
        </div>
        <p className='text-main font-bold text-xl group-hover:bg-linear-to-r group-hover:from-tertiary group-hover:to-primary group-hover:bg-clip-text group-hover:text-transparent'>
          Price
        </p>
        <div className={`p-2 rounded-2xl w-fit  text-main group-hover:text-primary ${openPrices && 'rotate-180'} transition-all ease-in-out duration-300 `}>
          <CiCircleChevDown size={28} />
        </div>
      </section>
      {openPrices && (
        <div className='w-full max-w-full overflow-hidden flex flex-col gap-4  px-3'>
          <div className='flex items-center  relative '>
            <div className='absolute ml-2'>
              <BsCurrencyDollar />
            </div>
            <input
              placeholder={`Min (Actual:${priceMin})`}
              type='number'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceMin(parseInt(e.target.value))}
              min={0}
              className='border pl-8 border-main rounded-2xl py-1 px-3 w-full min-w-0 placeholder:text-muted'
            />
          </div>
          <div className='flex items-center relative'>
            <div className='absolute ml-2'>
              <BsCurrencyDollar />
            </div>
            <input
              type='number'
              placeholder={`Max (Actual:${priceMax})`}
              min={0}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceMax(parseInt(e.target.value))}
              className='border pl-8 border-main rounded-2xl py-1 px-3 w-full min-w-0 placeholder:text-muted'
            />
          </div>

          <ul className='flex flex-col gap-4 items-start'>
            {priceOptions.map((opt, index) => (
              <li
                key={index}
                onClick={() => handleCategorySelect(opt)}
                className={`${priceMin === opt[0] && priceMax === opt[1] && selected} font-semibold text-lg  hover:font-bold rounded-2xl  py-1 px-2 hover:scale-110 hover:bg-muted/30 flex items-center`}
              >
                <BsCurrencyDollar />
                <span>{opt[0] !== 0 ? opt[0] : '<'}</span>
                <span>{opt[0] > 0 && opt[1] < 101 && ' - '}</span>
                <span>{opt[1] === Infinity ? '<' : opt[1]}</span>
              </li>
            ))}
          </ul>
          <div className='w-full flex justify-evenly pb-4'>
            <button
              onClick={() => setPriceFilter([priceMin, priceMax])}
              className='border border-primary rounded-2xl px-2 py-1 cursor-pointer hover:bg-primary/90 text-main'
            >
              Set filter
            </button>
            <button
              onClick={handleClear}
              className='border border-secondary rounded-2xl px-2 py-1 cursor-pointer hover:bg-secondary/90 text-main'
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default PriceBox
