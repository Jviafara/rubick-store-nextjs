import Image from 'next/image'

const Logo = () => {
  return (
    <div className='flex gap-2 justify-center items-center text-main uppercase font-plus-jakarta-sans'>
      <div className='w-9 h-9 relative'>
        <Image
          src={'/assets/logo.png'}
          alt={'Logo'}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          className='object-cover'
        />
      </div>

      <div className='hidden md:flex flex-col font-semibold text-xl leading-none'>
        <h1>Rubik&apos;S</h1>
        <h1>Store</h1>
      </div>
    </div>
  )
}

export default Logo
