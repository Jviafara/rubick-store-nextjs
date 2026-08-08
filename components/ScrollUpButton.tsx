import { SquareArrowUp } from 'lucide-react'

const ScrollUpButton = () => {
  return (
    <div className='fixed bottom-20 right-2 md:right-10 z-10'>
      <button
        type='button'
        onClick={() =>
          window.scrollTo({
            top: 0,
            behavior: 'smooth',
          })
        }
        className='hidden md:inline-flex cursor-pointer text-primary '
      >
        <SquareArrowUp size={32} />
      </button>
    </div>
  )
}

export default ScrollUpButton
