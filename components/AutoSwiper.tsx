import { AutoSwiperProps } from '@/lib/types'
import { Pagination } from 'swiper/modules'
import { Swiper } from 'swiper/react'

const AutoSwiper = ({ children, slideNumber }: AutoSwiperProps) => {
  return (
    <div className='flex w-full md:max-w-[80vw] overflow-visible'>
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
            spaceBetween: 15,
          },
          768: {
            slidesPerView: 2.5,
            spaceBetween: 15,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 20,
          },
          1536: {
            slidesPerView: 5,
            spaceBetween: 20,
          },
        }}
        modules={[Pagination]}
        style={{ padding: '20px 0 40px 0', width: '100%', overflow: 'visible' }}
      >
        {children}
      </Swiper>
    </div>
  )
}

export default AutoSwiper
