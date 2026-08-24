import Image from 'next/image'

const Logo = ({ full = false }: { full?: boolean }) => {
  return (
    <div className='flex gap-2 justify-center items-center text-main uppercase font-plus-jakarta-sans'>
      <div className='w-10 h-10 relative'>
        <Image
          src={'/assets/logo.png'}
          alt={'Logo'}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover'
        />
      </div>

      <div
        className={`${!full ? ' hidden md:flex' : 'flex'} flex-col items-center font-semibold text-xl leading-none -gap-1 uppercase`}
      >
        <h1 className='text-3xl font-bold font-seaweed-script leading-none [text-stroke:4px_var(--primary)]  text-primary tracking-wide'>
          Rubick
        </h1>
        <h1 className='text-base leading-none flex gap-0.5 w-full items-center'>
          <span className='w-full h-0 border-2 rounded-2xl border-primary'></span>
          <span className='text-gradient-cyan-magenta'>Store</span>
          <span className='w-full h-0 border-2 rounded-2xl border-secondary'></span>
        </h1>
      </div>
    </div>
  )
}

export default Logo
