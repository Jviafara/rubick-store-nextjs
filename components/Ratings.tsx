import { RatingsProps } from '@/lib/types'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'

const Ratings = (props: RatingsProps) => {
  const { rating, numReviews, totalSold } = props

  return (
    <div className='flex flex-col '>
      <div className='w-full flex gap-1 items-center'>
        <div className={`flex items-center text-accent ${rating! <= 1 && ' text-red-500'} ${rating! >= 4.5 && 'text-primary'}`}>
          <span>{rating! >= 1 ? <FaStar size={14} /> : rating! >= 0.5 ? <FaStarHalfAlt size={12} /> : <FaRegStar size={10} />}</span>
          <span>{rating! >= 2 ? <FaStar size={14} /> : rating! >= 1.5 ? <FaStarHalfAlt size={12} /> : <FaRegStar size={10} />}</span>
          <span>{rating! >= 3 ? <FaStar size={14} /> : rating! >= 2.5 ? <FaStarHalfAlt size={12} /> : <FaRegStar size={10} />}</span>
          <span>{rating! >= 4 ? <FaStar size={14} /> : rating! >= 3.5 ? <FaStarHalfAlt size={12} /> : <FaRegStar size={10} />}</span>
          <span>{rating! >= 5 ? <FaStar size={14} /> : rating! >= 4.5 ? <FaStarHalfAlt size={12} /> : <FaRegStar size={10} />}</span>
        </div>
        <div className='flex items-center'>
          <span className='text-main text-sm'>{(numReviews || 0) > 999 ? '999+' : numReviews}</span>
          <span className=' text-main text-sm font-bold'>({rating})</span>
        </div>
      </div>
      <p className='text-xs font-light text-muted font-plus-jakarta-sans'>{totalSold} items sold!</p>
    </div>
  )
}

export default Ratings
