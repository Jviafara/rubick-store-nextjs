import { ContainerProps } from '@/lib/types'
import Link from 'next/link'

const Container = ({ header, children, seeMore }: ContainerProps) => {
  return (
    <div className='mt-20 w-full max-w-[90vw]'>
      <div className='flex flex-col gap-8 w-full items-center '>
        {header && (
          <div className='relative xs:px-5 md:p-0 max-w-[90vw] md:max-w-341.5 mx-auto w-full flex items-center gap-8 '>
            <h1 className='font-bold uppercase text-lg md:txt-xl lg:text-2xl font-inter max-w-fit group'>
              {header}
              <span
                className='
                  left-0
                  bottom-0
                  block
                  w-2/3
                  h-1.25
                  bg-primary
                  group-hover:w-full
                '
              />
            </h1>
            {seeMore && (
              <div className='border border-primary text-xs sm:text-sm rounded-2xl bg-muted/20  py-2 px-4 hover:scale-105 text-nowrap'>
                <Link href={seeMore}>See More...!</Link>
              </div>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

export default Container
