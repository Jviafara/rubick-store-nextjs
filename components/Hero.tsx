'use client'

import RubiksCubeApp from './RubiksCube'

const Hero = () => {
  return (
    <header className='w-full h-full relative scrollbar-none flex flex-col gap-12'>
      <RubiksCubeApp />
    </header>
  )
}

export default Hero
