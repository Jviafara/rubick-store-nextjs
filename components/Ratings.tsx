import { RatingsProps } from '@/lib/types'
import { FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'

const Ratings = (props: RatingsProps) => {
  const { rating, numReviews } = props

  return (
    <div className='flex items-center'>
      <div className='flex'>
        <span>
          {rating! >= 1 ? (
            <FaStar
              size={18}
              color='#ffc800'
            />
          ) : rating! >= 0.5 ? (
            <FaStarHalfAlt
              size={18}
              color='#ffc800'
            />
          ) : (
            <FaRegStar
              size={18}
              color='#ffc800'
            />
          )}
        </span>
        <span>
          {rating! >= 2 ? (
            <FaStar
              size={18}
              color='#ffc800'
            />
          ) : rating! >= 1.5 ? (
            <FaStarHalfAlt
              size={18}
              color='#ffc800'
            />
          ) : (
            <FaRegStar
              size={18}
              color='#ffc800'
            />
          )}
        </span>
        <span>
          {rating! >= 3 ? (
            <FaStar
              size={18}
              color='#ffc800'
            />
          ) : rating! >= 2.5 ? (
            <FaStarHalfAlt
              size={18}
              color='#ffc800'
            />
          ) : (
            <FaRegStar
              size={18}
              color='#ffc800'
            />
          )}
        </span>
        <span>
          {rating! >= 4 ? (
            <FaStar
              size={18}
              color='#ffc800'
            />
          ) : rating! >= 3.5 ? (
            <FaStarHalfAlt
              size={18}
              color='#ffc800'
            />
          ) : (
            <FaRegStar
              size={18}
              color='#ffc800'
            />
          )}
        </span>
        <span>
          {rating! >= 5 ? (
            <FaStar
              size={18}
              color='#ffc800'
            />
          ) : rating! >= 4.5 ? (
            <FaStarHalfAlt
              size={18}
              color='#ffc800'
            />
          ) : (
            <FaRegStar
              size={18}
              color='#ffc800'
            />
          )}
        </span>
      </div>
      <div>
        <span className='m-1 text-black font-bold '>{numReviews}</span>
      </div>
    </div>
  )
}

export default Ratings
