import { NavigationSwiperProps } from '@/lib/types'
import { Swiper } from 'swiper/react'

const ImageNavigationSwiper = ({ children, onSwiper, onSlideChange }: NavigationSwiperProps) => {
  return (
    <div className='w-full h-full'>
      <Swiper
        onSwiper={onSwiper}
        onSlideChange={onSlideChange}
        slidesPerView={1}
        spaceBetween={0}
        speed={500}
        allowTouchMove
        className='h-full w-full'
      >
        {children}
      </Swiper>
    </div>
  )
}

export default ImageNavigationSwiper
