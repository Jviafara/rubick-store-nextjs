import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

const CheckoutSteps = () => {
  const searchParams = useSearchParams()
  const step: number = parseInt(searchParams.get('step') || '1')

  return (
    <section className='w-full h-fit flex items-center justify-center gap-2'>
      <div className='flex item-center gap-2 justify-center'>
        <Link
          href='/checkout?step=1'
          onClick={e => {
            if (step < 1 || step > 2) {
              e.preventDefault()
            }
          }}
          className={`h-8 w-8 ${step >= 1 ? 'bg-primary/90' : 'bg-surface'}  text-xl flex items-center justify-center rounded-full`}
        >
          1
        </Link>
        <h1 className='text-xl hidden md:inline'>Shipping</h1>
      </div>
      <div
        className={`w-48 h-1 rounded-full ${step < 2 ? 'bg-linear-to-r from-primary via-muted to-surface' : 'bg-primary'}`}
      />
      <div className='flex item-center justify-center  gap-2'>
        <Link
          href='/checkout?step=2'
          onClick={e => {
            if (step < 1 || step > 2) {
              e.preventDefault()
            }
          }}
          className={`h-8 w-8 ${step >= 2 ? 'bg-primary/90' : 'bg-surface'}  text-xl flex items-center justify-center rounded-full `}
        >
          2
        </Link>
        <h1 className='text-xl hidden md:inline'>Payment</h1>
      </div>
      <div
        className={`w-48 h-1 rounded-full ${step < 3 && step >= 2 ? 'bg-linear-to-r from-primary via-muted to-surface' : step >= 3 ? 'bg-primary ' : 'bg-surface'}`}
      />
      <div className='flex item-center justify-center  gap-2'>
        <div
          className={`h-8 w-8 ${step >= 3 ? 'bg-primary/90 ' : 'bg-surface'}  text-xl flex items-center justify-center rounded-full `}
        >
          3
        </div>
        <h1 className='text-xl hidden md:inline'>Review</h1>
      </div>
    </section>
  )
}

export default CheckoutSteps
