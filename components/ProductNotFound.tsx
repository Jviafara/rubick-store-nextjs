import Link from 'next/link'
import { ArrowLeft, Search, PackageX } from 'lucide-react'
import { useRouter } from 'next/navigation'

const ProductNotFoundBanner = () => {
  const router = useRouter()

  return (
    <div className='relative mx-auto flex w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#050812]/90 p-8 shadow-[0_0_50px_rgba(0,240,255,0.04)]'>
      {/* Glow */}
      <div className='pointer-events-none absolute -left-20 -top-20 h-48 w-48 rounded-full bg-cyan-400/10 blur-3xl' />
      <div className='pointer-events-none absolute -bottom-20 -right-20 h-48 w-48 rounded-full bg-pink-500/10 blur-3xl' />

      <div className='relative flex w-full flex-col items-center justify-center gap-5 text-center'>
        <div className='flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/30 bg-cyan-400/5 shadow-[0_0_25px_rgba(0,240,255,0.08)]'>
          <PackageX className='h-8 w-8 text-cyan-400' />
        </div>

        <div>
          <p className='mb-1 text-[10px] font-bold uppercase tracking-[0.25em] text-cyan-400'>PRODUCT NOT FOUND</p>

          <h2 className='text-xl font-bold text-white sm:text-2xl'>We couldn&apos;t find that cube</h2>

          <p className='mx-auto mt-2 max-w-md text-sm leading-6 text-gray-400'>
            The product you&apos;re looking for may have been removed, discontinued, or the link may be incorrect.
          </p>
        </div>

        <div className='flex flex-col gap-3 sm:flex-row'>
          <button
            type='button'
            onClick={() => router.back()}
            className='flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-xs font-bold text-gray-300 transition hover:border-cyan-400/30 hover:text-white uppercase'
          >
            <ArrowLeft className='h-4 w-4' />
            Go Back
          </button>
          <Link
            href='/products'
            className='flex h-11 items-center justify-center gap-2 rounded-xl bg-linear-to-r from-cyan-400 via-blue-500 to-pink-500 px-6 text-xs font-bold text-white shadow-[0_0_25px_rgba(0,240,255,0.12)] transition hover:scale-[1.02]'
          >
            <Search className='h-4 w-4' />
            BROWSE PRODUCTS
          </Link>

          <Link
            href='/'
            className='flex h-11 items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-6 text-xs font-bold text-gray-300 transition hover:border-cyan-400/30 hover:text-white'
          >
            <ArrowLeft className='h-4 w-4' />
            GO HOME
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ProductNotFoundBanner
