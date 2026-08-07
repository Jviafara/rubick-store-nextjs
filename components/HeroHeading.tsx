import { FaCube } from 'react-icons/fa'

const HeroHeading = () => {
  return (
    <div className='mb-10 text-center sm:mb-12 lg:mb-14'>
      <div className='mb-3 flex items-center justify-center gap-3'>
        <span className='h-px w-10 bg-linear-to-r from-transparent to-primary sm:w-16' />

        <span className='flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.35em] text-primary sm:text-xs'>
          <FaCube />
          3D Cube Experience
        </span>

        <span className='h-px w-10 bg-linear-to-l from-transparent to-secondary sm:w-16' />
      </div>

      <h2 className='font-jakarta text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl'>
        EXPLORE <span className='bg-linear-to-r from-primary via-blue-400 to-secondary bg-clip-text text-transparent'>EVERY ANGLE</span>
      </h2>

      <p className='mx-auto mt-4 max-w-2xl text-sm leading-6 text-foreground/60 sm:text-base'>
        Interact with the cube in real time. Scramble it, watch every move, and solve it with our 3D experience.
      </p>
    </div>
  )
}

export default HeroHeading
