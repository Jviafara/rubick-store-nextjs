import CheckoutSteps from '@/components/CheckoutSteps'
import { render, screen } from '@testing-library/react'
import { useSearchParams } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

const renderAtStep = (step?: number) => {
  jest.mocked(useSearchParams).mockReturnValue(new URLSearchParams(step ? `step=${step}` : '') as never)

  return render(<CheckoutSteps />)
}

describe('CheckoutSteps', () => {
  it('shows the three checkout stages', () => {
    renderAtStep(1)

    expect(screen.getByRole('heading', { name: 'Shipping' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Payment' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Review' })).toBeInTheDocument()
  })

  it('links the first two steps to the checkout page', () => {
    renderAtStep(2)

    expect(screen.getByRole('link', { name: '1' })).toHaveAttribute('href', '/checkout?step=1')
    expect(screen.getByRole('link', { name: '2' })).toHaveAttribute('href', '/checkout?step=2')
  })

  it('does not make the review step a link', () => {
    renderAtStep(3)

    expect(screen.queryByRole('link', { name: '3' })).not.toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('defaults to the first step when the URL has no step', () => {
    renderAtStep()

    expect(screen.getByText('1')).toHaveClass('bg-primary/90')
    expect(screen.getByText('2')).toHaveClass('bg-surface')
    expect(screen.getByText('3')).toHaveClass('bg-surface')
  })

  it.each([
    [1, ['bg-primary/90', 'bg-surface', 'bg-surface']],
    [2, ['bg-primary/90', 'bg-primary/90', 'bg-surface']],
    [3, ['bg-primary/90', 'bg-primary/90', 'bg-primary/90']],
  ])('highlights the steps reached at step %p', (step, expectedClasses) => {
    renderAtStep(step)

    ;['1', '2', '3'].forEach((label, index) => {
      expect(screen.getByText(label)).toHaveClass(expectedClasses[index])
    })
  })
})
