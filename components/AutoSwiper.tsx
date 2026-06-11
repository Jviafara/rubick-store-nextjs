import { AutoSwiperProps } from '@/lib/types'
import { Pagination } from 'swiper/modules'
import { Swiper } from 'swiper/react'

const AutoSwiper = ({ children }: AutoSwiperProps) => {
  return (
    <div className='flex w-full md:max-w-[80vw] relative z-0'>
      <Swiper
        // slidesPerView={2}
        loop={true}
        // spaceBetween={2}
        pagination={{
          dynamicBullets: true,
        }}
        breakpoints={{
          375: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          640: {
            slidesPerView: 3,
            spaceBetween: 25,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 3,
            spaceBetween: 35,
          },
          1536: {
            slidesPerView: 4,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        style={{ padding: '20px 0 40px 0' }}
      >
        {children}
      </Swiper>
    </div>
  )
}

export default AutoSwiper
