import ProductNotFoundBanner from '@/components/ProductNotFound'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

describe('ProductNotFound', () => {
  const back = jest.fn()

  beforeEach(() => {
    jest.mocked(useRouter).mockReturnValue({ back } as never)
    render(<ProductNotFoundBanner />)
  })

  it('explains that the product could not be found', () => {
    expect(screen.getByText('PRODUCT NOT FOUND')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 2, name: /couldn't find that cube/i })).toBeInTheDocument()
  })

  it('goes back in history when "Go Back" is clicked', async () => {
    const user = userEvent.setup()

    await user.click(screen.getByRole('button', { name: /go back/i }))

    expect(back).toHaveBeenCalledTimes(1)
  })

  it('links to the products page and the home page', () => {
    expect(screen.getByRole('link', { name: /browse products/i })).toHaveAttribute('href', '/products')
    expect(screen.getByRole('link', { name: /go home/i })).toHaveAttribute('href', '/')
  })
})
