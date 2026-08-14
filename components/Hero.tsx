'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import RubiksCubeApp from './RubiksCube'
import { SortByEnum } from '@/lib/constants'
import * as motion from 'motion/react-client'
import { useWindowHeight } from '@/lib/hooks/useWindowHeight'

const Hero = () => {
  const [scrollY, setScrollY] = useState(0)
  const buttonLimit = 300
  const innerHeigt = useWindowHeight() || 1024
  const cubeLimit = innerHeigt / 3

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className='w-full h-[calc(100vh-76px)] relative scrollbar-none'>
      <motion.div
        initial={{ opacity: 0.5 }}
        animate={scrollY > cubeLimit ? { opacity: 0.5 } : { opacity: 1 }}
        transition={{ duration: 0.5 }}
        className='w-full h-full'
      >
        <RubiksCubeApp />
      </motion.div>
      <div className='absolute bottom-1/6 left-1/2 -translate-x-1/2 w-full flex flex-col md:flex-row items-center justify-center gap-16 '>
        <motion.div
          initial={{ opacity: 0, x: -200 }}
          animate={scrollY > buttonLimit ? { opacity: 0, x: -200 } : { opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href={`/products?sort_by=${SortByEnum.best_sellers}`}
            className='card-gradient-featured uppercase px-6 py-3 rounded-2xl font-bold text-xl font-plus-jakarta-sans'
          >
            Shop best sellers
          </Link>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 200 }}
          animate={scrollY > buttonLimit ? { opacity: 0, x: 200 } : { opacity: 1, x: 0 }}
          viewport={{ once: false }}
          transition={{ duration: 0.5 }}
        >
          <Link
            href={`/products?sort_by=${SortByEnum.top_rated}`}
            className='card-gradient-featured uppercase px-6 py-3 rounded-2xl font-bold text-xl font-plus-jakarta-sans'
          >
            Shop Top Rated
          </Link>
        </motion.div>
      </div>
    </header>
  )
}

export default Hero
