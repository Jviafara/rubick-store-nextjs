import ScrollUpButton from '@/components/ScrollUpButton'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('ScrollUpButton', () => {
  it('scrolls smoothly to the top of the page when clicked', async () => {
    const user = userEvent.setup()
    const scrollTo = jest.fn()
    window.scrollTo = scrollTo as unknown as typeof window.scrollTo

    render(<ScrollUpButton />)
    await user.click(screen.getByRole('button'))

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' })
  })
})
