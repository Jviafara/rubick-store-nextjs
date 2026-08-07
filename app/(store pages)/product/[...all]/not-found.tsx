'use client'
import Link from 'next/link'
import { ArrowLeft, Home, Search, PackageX } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ProductNotFound = () => {
  const router = useRouter()
  return (
    <main className='relative flex min-h-[70vh] w-full items-center justify-center overflow-hidden px-4 py-16'>
      {/* Background glow */}
      <div className='pointer-events-none absolute left-1/2 top-1/2 h-125 w-125 -translate-x-1/2 -translate-y-1/2 rounded-full bg-cyan-400/5 blur-[120px]' />

      <div className='pointer-events-none absolute left-[15%] top-[20%] h-40 w-40 rounded-full bg-blue-500/5 blur-3xl' />

      <div className='pointer-events-none absolute bottom-[10%] right-[15%] h-40 w-40 rounded-full bg-pink-500/5 blur-3xl' />

      {/* Card */}
      <div className='relative w-full max-w-2xl overflow-hidden rounded-3xl border border-white/10 bg-[#050812]/90 p-8 text-center shadow-[0_0_80px_rgba(0,240,255,0.05)] sm:p-12'>
        {/* Top gradient line */}
        <div className='absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-400 to-transparent' />

        {/* Icon */}
        <div className='mx-auto mb-7 flex h-24 w-24 items-center justify-center rounded-3xl border border-cyan-400/20 bg-cyan-400/5 shadow-[0_0_40px_rgba(0,240,255,0.08)]'>
          <PackageX className='h-11 w-11 text-cyan-400' />
        </div>

        {/* 404 */}
        <div className='mb-2 bg-linear-to-r from-cyan-400 via-blue-400 to-pink-500 bg-clip-text text-6xl font-black tracking-tight text-transparent sm:text-7xl'>
          404
        </div>

        <p className='text-[10px] font-bold uppercase tracking-[0.35em] text-pink-400'>PRODUCT NOT FOUND</p>

        <h1 className='mt-4 text-2xl font-bold text-white sm:text-3xl'>This cube doesn&apos;t exist</h1>

        <p className='mx-auto mt-3 max-w-md text-sm leading-6 text-gray-400'>
          Looks like this product got scrambled out of existence. Don&apos;t worry — there are plenty of other cubes
          waiting for you.
        </p>

        {/* Actions */}
        <div className='mt-8 flex flex-col justify-center gap-3 sm:flex-row'>
          <button
            type='button'
            onClick={() => router.back()}
            className='flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 text-xs font-bold text-gray-300 transition hover:border-cyan-400/30 hover:text-white uppercase'
          >
            <ArrowLeft className='h-4 w-4' />
            Go Back
          </button>
          <Link
            href='/products'
            className='flex h-12 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-pink-500 px-7 text-xs font-bold text-white shadow-[0_0_30px_rgba(0,240,255,0.12)] transition hover:scale-[1.02]'
          >
            <Search className='h-4 w-4' />
            EXPLORE CUBES
          </Link>

          <Link
            href='/'
            className='flex h-12 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-7 text-xs font-bold text-gray-300 transition hover:border-cyan-400/30 hover:text-white'
          >
            <Home className='h-4 w-4' />
            BACK HOME
          </Link>
        </div>

        {/* Bottom decoration */}
        <div className='mx-auto mt-10 flex max-w-xs items-center gap-3'>
          <div className='h-px flex-1 bg-linear-to-r from-transparent to-white/10' />
          <span className='text-[9px] font-medium uppercase tracking-widest text-gray-600'>RUBICK STORE</span>
          <div className='h-px flex-1 bg-linear-to-l from-transparent to-white/10' />
        </div>
      </div>
    </main>
  )
}

export default ProductNotFound
