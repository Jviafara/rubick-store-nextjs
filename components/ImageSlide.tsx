import Image from 'next/image'
import { SwiperSlide } from 'swiper/react'
import NavigationSwiper from './NavigationSwiper'

const ImageSlide = ({ images }: { images: string[] }) => {
  return (
    <div className='flex flex-col justify-center'>
      <div className='flex gap-2 justify-center'>
        {images?.map((image, index) => (
          <Image
            key={index}
            src={image}
            alt={'Images'}
            loading='eager'
            width={500}
            height={500}
            className='w-[5vw] bg-cover rounded-lg'
          />
        ))}
      </div>
      <NavigationSwiper>
        {images?.map((image, index) => (
          <SwiperSlide
            key={index}
            className='swipper-slide px-10 pt-4 pb-10'
          >
            <Image
              src={image}
              alt={'Images'}
              width={500}
              loading='eager'
              height={500}
              className='w-full bg-cover rounded-lg'
            />
          </SwiperSlide>
        ))}
      </NavigationSwiper>
    </div>
  )
}

export default ImageSlide
