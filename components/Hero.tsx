'use client'

import RubiksCube from './RubiksCube'

const Hero = () => {
  return (
    <header className='relative flex h-full w-full flex-col gap-12 scrollbar-none'>
      <RubiksCube />
    </header>
  )
}

export default Hero
