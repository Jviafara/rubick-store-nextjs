import { ArrowRight, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { IconType } from 'react-icons/lib'

interface EmptyBannerProps {
  header: string
  Icon: IconType
}

const EmptyBanner = ({ header, Icon }: EmptyBannerProps) => {
  return (
    <div className='relative flex min-h-105 w-[95vw] md:max-w-[90vw] mt-12 lg:w-[80vw] items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-[#050812]/90 px-6 py-12'>
      {/* Ambient glow */}
      <div className='pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[100px]' />

      <div className='pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-pink-500/5 blur-3xl' />

      <div className='relative flex max-w-md flex-col items-center text-center'>
        {/* Icon */}
        <div className='relative mb-6'>
          <div className='absolute inset-0 rounded-2xl bg-cyan-400/10 blur-xl' />

          <div className='relative flex h-20 w-20 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#0a101c]'>
            <Icon className='h-9 w-9 text-cyan-400' />
            <div className='absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-pink-400/30 bg-pink-500/10'>
              <Sparkles className='h-3 w-3 text-pink-400' />
            </div>
          </div>
        </div>

        <p className='text-[10px] font-bold uppercase tracking-[0.3em] text-cyan-400'>{header}</p>

        <h2 className='mt-3 text-2xl font-bold text-white'>Nothing here yet</h2>

        <p className='mt-3 text-sm leading-6 text-gray-400'>Your next personal best could be one cube away. Explore our collection and find your perfect speed cube.</p>

        <Link
          href='/products'
          className='mt-7 flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-pink-500 px-8 text-xs font-bold text-white shadow-[0_0_30px_rgba(0,240,255,0.12)] transition hover:scale-[1.02]'
        >
          SHOP CUBES
          <ArrowRight className='h-4 w-4' />
        </Link>

        <p className='mt-5 text-[10px] text-gray-600'>FREE SHIPPING ON ORDERS OVER $100</p>
      </div>
    </div>
  )
}

export default EmptyBanner
