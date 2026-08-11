import { useState } from 'react'
import { BsCurrencyDollar } from 'react-icons/bs'
import { CiCircleChevDown } from 'react-icons/ci'
import { MdOutlinePriceChange } from 'react-icons/md'

const PriceBox = () => {
  const [openPrices, setOpenPrices] = useState(false)

  const [priceMin, setPriceMin] = useState(0)
  const [priceMax, setPriceMax] = useState(1000)
  return (
    <div className='flex flex-col items-center capitalize group card-gradient-emerald-cyan w-full max-w-full relative'>
      <section
        onClick={() => setOpenPrices(!openPrices)}
        className='w-full flex items-center justify-between cursor-pointer px-2'
      >
        <div className='p-2 rounded-2xl w-fit  text-main group-hover:text-tertiary hidden 2xl:block'>
          <MdOutlinePriceChange size={28} />
        </div>
        <p className='text-main font-bold text-xl group-hover:bg-linear-to-r group-hover:from-tertiary group-hover:to-primary group-hover:bg-clip-text group-hover:text-transparent'>
          Price
        </p>
        <div
          className={`p-2 rounded-2xl w-fit  text-main group-hover:text-primary ${openPrices && 'rotate-180'} transition-all ease-in-out duration-300 hidden lg:block`}
        >
          <CiCircleChevDown size={28} />
        </div>
      </section>
      {openPrices && (
        <div className='w-full max-w-full overflow-hidden flex flex-col gap-4 items-center'>
          <div className='flex items-center'>
            <input
              placeholder={`Min (Actual:${priceMin})`}
              type='number'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceMin(parseInt(e.target.value))}
              min={0}
              className='border pl-8 border-main rounded-2xl py-1 px-3 max-w-1/2'
            />
          </div>
          <div className='flex items-center relative '>
            <div className='absolute ml-2'>
              <BsCurrencyDollar />
            </div>
            <input
              placeholder={`Min (Actual:${priceMin})`}
              type='number'
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPriceMin(parseInt(e.target.value))}
              min={0}
              className='border pl-8 border-main rounded-2xl py-1 px-3'
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
              className='border pl-8 border-main rounded-2xl py-1 px-3 '
            />
          </div>
          {/* <ul>
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
          </ul> */}
        </div>
      )}
    </div>
  )
}

export default PriceBox
