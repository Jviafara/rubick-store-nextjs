'use client'

import * as motion from 'motion/react-client'
import { useEffect, useState } from 'react'
import ProductSlide from './ProductSlide'
import Container from './Container'
import { SortByEnum } from '@/lib/constants'

const LandingPageSliders = () => {
  const [scrollY, setScrollY] = useState(0)
  const buttonLimit = 300

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0, y: 600 }}
      animate={scrollY > buttonLimit ? { opacity: 1, y: -400, marginBottom: -350 } : { opacity: 0, y: 600 }}
      transition={{ duration: 0.5 }}
      className='w-full max-w-[100vw] md:w-[90%] lg:w-[85%] 2xl:w:[75%] mx-auto flex flex-col items-center relative overflow-x-hidden'
    >
      <Container
        header='Top Sellers'
        seeMore={`/products?sort_by=${SortByEnum.best_sellers}`}
      >
        <ProductSlide slideType={SortByEnum.best_sellers} />
      </Container>
      <Container
        header='Top Rated'
        seeMore={`/products?sort_by=${SortByEnum.top_rated}`}
      >
        <ProductSlide slideType={SortByEnum.top_rated} />
      </Container>
      <Container
        header='Newest additions'
        seeMore={`/products?sort_by=${SortByEnum.latest}`}
      >
        <ProductSlide slideType={SortByEnum.top_rated} />
      </Container>
    </motion.main>
  )
}

export default LandingPageSliders
