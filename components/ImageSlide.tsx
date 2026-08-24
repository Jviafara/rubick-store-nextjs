'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { SwiperSlide } from 'swiper/react'
import type { Swiper as SwiperInstance } from 'swiper'
import ImageNavigationSwiper from './ImageNavigatorSwiper'
import { Maximize2, X } from 'lucide-react'

const ImageSlide = ({ images }: { images: string[] }) => {
  const [swiper, setSwiper] = useState<SwiperInstance | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!isFullscreen) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsFullscreen(false)
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [isFullscreen])

  if (!images?.length) return null

  return (
    <>
      <div className='flex w-full flex-col gap-4'>
        <div className='flex flex-col md:flex-row w-full gap-3'>
          {/* Thumbnails */}
          <div className='flex w-full shrink-0  md:flex-col gap-3 sm:w-20'>
            {images.map((image, index) => {
              const isActive = activeIndex === index

              return (
                <button
                  key={index}
                  type='button'
                  onClick={() => swiper?.slideToLoop(index)}
                  aria-label={`View product image ${index + 1}`}
                  aria-current={isActive}
                  className={`
                    relative aspect-square w-full overflow-hidden rounded-xl
                    border bg-surface/60 p-1.5
                    transition-all duration-300
                    ${isActive ? 'border-primary/80 shadow-[0_0_20px_rgba(0,240,255,0.18)]' : 'border-border opacity-60 hover:border-cprimary/40 hover:opacity-100'}
                  `}
                >
                  {isActive && <span className='pointer-events-none absolute inset-0 rounded-xl bg-linear-to-br from-primary/10 via-transparent to-secondary/10' />}

                  <Image
                    src={image}
                    alt={`Product thumbnail ${index + 1}`}
                    fill
                    sizes='80px'
                    loading={index === 0 ? 'eager' : 'lazy'}
                    className='relative z-10 rounded-lg object-cover'
                  />
                </button>
              )
            })}
          </div>

          {/* Main image */}
          <div className='relative min-w-0 flex-1 overflow-hidden rounded-2xl border border-border h-fit bg-surface/30'>
            <div className='relative aspect-square w-full overflow-hidden'>
              {/* Background glow */}
              <div
                aria-hidden='true'
                className='pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.08),transparent_45%)]'
              />

              <ImageNavigationSwiper
                onSwiper={setSwiper}
                onSlideChange={swiper => setActiveIndex(swiper.realIndex)}
              >
                {images.map((image, index) => (
                  <SwiperSlide
                    key={index}
                    className='flex! items-center justify-center'
                  >
                    <div className='group relative flex aspect-square w-full items-center justify-center p-6 sm:p-10 lg:p-14'>
                      <Image
                        src={image}
                        alt={`Product image ${index + 1}`}
                        fill
                        priority={index === 0}
                        loading={'eager'}
                        sizes='
                                (max-width: 640px) 90vw,
                                (max-width: 1024px) 55vw,
                                50vw
                              '
                        className='object-contain'
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </ImageNavigationSwiper>

              {/* Image counter */}
              <div className='absolute bottom-4 left-1/2 z-30 -translate-x-1/2'>
                <div className='flex items-center gap-3 rounded-full border border-border bg-surface/80 px-3 py-1.5 text-[10px] font-semibold text-foreground/60 shadow-lg backdrop-blur-xl sm:text-xs'>
                  <span className='text-cyan-300'>{String(activeIndex + 1).padStart(2, '0')}</span>

                  <span className='text-foreground/30'>/</span>

                  <span>{String(images.length).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Fullscreen icon */}
              <button
                type='button'
                onClick={() => setIsFullscreen(true)}
                className='absolute bottom-4 right-4 z-30 flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-surface/80 text-foreground/60 backdrop-blur-xl transition hover:border-fuchsia-400/40 hover:text-fuchsia-300'
                aria-label='Open image fullscreen'
              >
                <Maximize2 size={16} />
              </button>
            </div>

            {/* Navigation */}
            <button
              type='button'
              onClick={() => swiper?.slidePrev()}
              aria-label='Previous image'
              className='absolute left-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/75 text-foreground/70 backdrop-blur-xl transition hover:border-cyan-400/50 hover:text-cyan-300'
            >
              ←
            </button>

            <button
              type='button'
              onClick={() => swiper?.slideNext()}
              aria-label='Next image'
              className='absolute right-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-surface/75 text-foreground/70 backdrop-blur-xl transition hover:border-fuchsia-400/50 hover:text-fuchsia-300'
            >
              →
            </button>
          </div>
        </div>
      </div>

      {/* Zoom modal */}
      {isFullscreen && (
        <div
          className='fixed inset-0 z-100 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md'
          onClick={() => setIsFullscreen(false)}
        >
          <button
            type='button'
            onClick={() => setIsFullscreen(false)}
            className='absolute right-5 top-5 z-20 flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/10 text-white transition hover:bg-white/20'
            aria-label='Close image'
          >
            <X size={22} />
          </button>

          <div
            className='relative h-[90vh] w-[90vw] max-w-6xl'
            onClick={event => event.stopPropagation()}
          >
            <Image
              src={images[activeIndex]}
              alt={`Product image ${activeIndex + 1}`}
              fill
              sizes='90vw'
              className='object-contain'
              priority
            />
          </div>
        </div>
      )}
    </>
  )
}

export default ImageSlide
