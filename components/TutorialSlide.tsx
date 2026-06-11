'use client'
import { videos } from '@/lib/constants'
import { mediaVideoProps } from '@/lib/types'
import { useEffect } from 'react'
import { useRef } from 'react'
import { SwiperSlide } from 'swiper/react'
import NavigationSwiper from './NavigationSwiper'

const MediaVideo = ({ video }: mediaVideoProps) => {
  const iFrameRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const updateHeight = () => {
      if (iFrameRef.current) {
        const height = (iFrameRef.current.offsetWidth * 9) / 16
        iFrameRef.current.style.height = `${height}px`
      }
    }

    updateHeight()
    window.addEventListener('resize', updateHeight)

    return () => {
      window.removeEventListener('resize', updateHeight)
    }
  }, [])

  return (
    <div className='max-h-max'>
      <iframe
        key={video.id}
        src={`https://youtube.com/embed/${video.id}?autoplay=0`}
        ref={iFrameRef}
        width='100%'
        title={video.name}
        style={{ border: 0 }}
      ></iframe>
    </div>
  )
}

const TutorialSlide = () => {
  return (
    <div className='container mx-auto'>
      <NavigationSwiper>
        {videos.map((video, index) => (
          <SwiperSlide
            key={index}
            className='swipper-slide px-10 pt-4 pb-10'
          >
            <MediaVideo video={video} />
          </SwiperSlide>
        ))}
      </NavigationSwiper>
    </div>
  )
}

export default TutorialSlide
