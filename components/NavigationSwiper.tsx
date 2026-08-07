import { NavigationSwiperProps } from '@/lib/types'
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
import { Swiper } from 'swiper/react'

const NavigationSwiper = ({ children }: NavigationSwiperProps) => {
  return (
    <div className='w-full h-full'>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        centeredSlides={true}
        grabCursor={true}
        centeredSlidesBounds={true}
        loop={true}
        pagination={{ clickable: true }}
        navigation={true}
        modules={[Navigation, Pagination, Autoplay]}
        style={
          {
            '--swiper-navigation-color': 'var(--primary)',
            '--swiper-navigation-size': '28px',
          } as React.CSSProperties
        }
        className='w-full max-h-max p-0 flex justify-center items-center'
      >
        {children}
      </Swiper>
    </div>
  )
}

export default NavigationSwiper
