import SortBy from '@/components/SortBy'
import { SortByEnum } from '@/lib/constants'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const setup = async ({ sortBy = SortByEnum.latest as string, open = true } = {}) => {
  const user = userEvent.setup()
  const setSortBy = jest.fn()

  const utils = render(
    <SortBy
      sortBy={sortBy}
      setSortBy={setSortBy}
    />,
  )

  if (open) await user.click(screen.getByText('Sort By'))

  return { user, setSortBy, ...utils }
}

describe('SortBy', () => {
  it('starts collapsed', async () => {
    await setup({ open: false })

    expect(screen.getByText('Sort By')).toBeInTheDocument()
    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('lists every sort option when opened', async () => {
    await setup()

    Object.values(SortByEnum).forEach(option => {
      expect(screen.getByText(option.toUpperCase())).toBeInTheDocument()
    })
    expect(screen.getAllByRole('listitem')).toHaveLength(Object.values(SortByEnum).length)
  })

  it('collapses when the header is clicked again', async () => {
    const { user } = await setup()

    await user.click(screen.getByText('Sort By'))

    expect(screen.queryByRole('listitem')).not.toBeInTheDocument()
  })

  it('calls setSortBy with the original option value', async () => {
    const { user, setSortBy } = await setup()

    await user.click(screen.getByText('TOP RATED'))

    expect(setSortBy).toHaveBeenCalledWith(SortByEnum.top_rated)
  })

  it('marks only the active option as selected', async () => {
    const { container } = await setup({ sortBy: SortByEnum.best_sellers })

    const selected = container.querySelectorAll('svg.text-primary')
    expect(selected).toHaveLength(1)
    expect(selected[0].closest('li')).toHaveTextContent('BEST SELLERS')
  })
})
