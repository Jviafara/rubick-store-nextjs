import { FaCheck, FaCube, FaRocket } from 'react-icons/fa'

const HeroFeatureRow = () => {
  return (
    <div className='mx-auto mt-7 grid max-w-250 grid-cols-1 gap-3 sm:grid-cols-3'>
      <div className='rounded-xl border border-border/70 bg-surface/70 px-4 py-3 text-center'>
        <FaCheck className='mx-auto mb-2 text-tertiary' />

        <p className='text-xs font-semibold text-foreground'>Real-time animation</p>
      </div>

      <div className='rounded-xl border border-border/70 bg-surface/70 px-4 py-3 text-center'>
        <FaCube className='mx-auto mb-2 text-primary' />

        <p className='text-xs font-semibold text-foreground'>Interactive 3D cube</p>
      </div>

      <div className='rounded-xl border border-border/70 bg-surface/70 px-4 py-3 text-center'>
        <FaRocket className='mx-auto mb-2 text-secondary' />

        <p className='text-xs font-semibold text-foreground'>Automatic solver</p>
      </div>
    </div>
  )
}

export default HeroFeatureRow
