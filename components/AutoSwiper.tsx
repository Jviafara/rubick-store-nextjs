import { AutoSwiperProps } from '@/lib/types'
import { Pagination } from 'swiper/modules'
import { Swiper } from 'swiper/react'

const AutoSwiper = ({ children, slideNumber }: AutoSwiperProps) => {
  return (
    <div className='flex w-full md:max-w-[80vw]'>
      <Swiper
        // slidesPerView={2}
        loop={(slideNumber || 1) >= 4}
        // spaceBetween={2}
        pagination={{
          dynamicBullets: true,
        }}
        breakpoints={{
          375: {
            slidesPerView: 1,
            spaceBetween: 15,
          },
          425: {
            slidesPerView: 1.5,
            spaceBetween: 25,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 35,
          },
          1536: {
            slidesPerView: 5,
            spaceBetween: 50,
          },
        }}
        modules={[Pagination]}
        style={{ padding: '20px 0 40px 0', width: '100%' }}
      >
        {children}
      </Swiper>
    </div>
  )
}

export default AutoSwiper
