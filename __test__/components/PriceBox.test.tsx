import PriceBox from '@/components/PriceBox'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const setup = async ({ open = true } = {}) => {
  const user = userEvent.setup()
  const setPriceFilter = jest.fn()

  render(<PriceBox setPriceFilter={setPriceFilter} />)

  if (open) await user.click(screen.getByText('Price'))

  return { user, setPriceFilter }
}

describe('PriceBox', () => {
  it('starts collapsed', async () => {
    await setup({ open: false })

    expect(screen.getByText('Price')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /set filter/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('expands and collapses when the header is clicked', async () => {
    const { user } = await setup()

    expect(screen.getByRole('button', { name: /set filter/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /clear/i })).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(5)

    await user.click(screen.getByText('Price'))

    expect(screen.queryByRole('button', { name: /set filter/i })).not.toBeInTheDocument()
  })

  it('shows the current min and max in the placeholders', async () => {
    await setup()

    expect(screen.getByPlaceholderText('Min (Actual:0)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Max (Actual:1000)')).toBeInTheDocument()
  })

  it('applies a preset range when it is clicked', async () => {
    const { user, setPriceFilter } = await setup()

    await user.click(screen.getAllByRole('listitem')[1])

    expect(setPriceFilter).toHaveBeenCalledWith([10, 25])
    expect(screen.getByPlaceholderText('Min (Actual:10)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Max (Actual:25)')).toBeInTheDocument()
  })

  it('supports an open-ended preset', async () => {
    const { user, setPriceFilter } = await setup()

    await user.click(screen.getAllByRole('listitem')[4])

    expect(setPriceFilter).toHaveBeenCalledWith([100, Infinity])
  })

  it('applies a custom range typed by the user', async () => {
    const { user, setPriceFilter } = await setup()

    await user.type(screen.getByPlaceholderText(/^min/i), '5')
    await user.type(screen.getByPlaceholderText(/^max/i), '50')
    await user.click(screen.getByRole('button', { name: /set filter/i }))

    expect(setPriceFilter).toHaveBeenLastCalledWith([5, 50])
  })

  it('applies the default range when "Set filter" is clicked without typing', async () => {
    const { user, setPriceFilter } = await setup()

    await user.click(screen.getByRole('button', { name: /set filter/i }))

    expect(setPriceFilter).toHaveBeenCalledWith([0, 1000])
  })

  it('clears the filter', async () => {
    const { user, setPriceFilter } = await setup()

    await user.click(screen.getAllByRole('listitem')[2])
    await user.click(screen.getByRole('button', { name: /clear/i }))

    expect(setPriceFilter).toHaveBeenLastCalledWith([0, Infinity])
    expect(screen.getByPlaceholderText('Min (Actual:0)')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Max (Actual:Infinity)')).toBeInTheDocument()
  })
})
