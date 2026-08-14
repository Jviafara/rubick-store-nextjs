import Hero from '@/components/Hero'
import { Metadata } from 'next'
import LandingPageSliders from '@/components/LandingPageSliders'

export const metadata: Metadata = {
  title: 'Home',
}

export default function Home() {
  return (
    <div className='flex flex-col items-center relative h-fit'>
      <Hero />
      <LandingPageSliders />
    </div>
  )
}
