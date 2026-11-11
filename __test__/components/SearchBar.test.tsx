import SearchBar from '@/components/SearchBar'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useSearchParams } from 'next/navigation'
import type { ComponentProps } from 'react'

jest.mock('next/navigation', () => ({
  useSearchParams: jest.fn(),
}))

const mockSearchParams = (queryString = '') => {
  jest.mocked(useSearchParams).mockReturnValue(new URLSearchParams(queryString) as never)
}

const setup = (props: Partial<ComponentProps<typeof SearchBar>> = {}) => {
  const setQuery = jest.fn()
  const handleSearchClick = jest.fn()
  const user = userEvent.setup()

  const utils = render(
    <SearchBar
      setQuery={setQuery}
      handleSearchClick={handleSearchClick}
      {...props}
    />,
  )

  return { user, setQuery, handleSearchClick, ...utils }
}

describe('SearchBar', () => {
  beforeEach(() => {
    mockSearchParams()
  })

  it('renders a text input with a placeholder based on the type', () => {
    setup({ type: 'products' })

    expect(screen.getByPlaceholderText('Search products')).toBeInTheDocument()
  })

  it('shows the current query in the input', () => {
    setup({ query: 'cube', type: 'products' })

    expect(screen.getByRole('textbox')).toHaveValue('cube')
  })

  it('reports what the user types', async () => {
    const { user, setQuery } = setup({ type: 'products' })

    await user.type(screen.getByRole('textbox'), 'a')

    expect(setQuery).toHaveBeenLastCalledWith('a')
  })

  describe('syncing with the URL', () => {
    it('clears the query when the URL has none', () => {
      const { setQuery } = setup()

      expect(setQuery).toHaveBeenCalledWith('')
    })

    it('uses the query from the URL when present', () => {
      mockSearchParams('query=moyu')

      const { setQuery } = setup()

      expect(setQuery).toHaveBeenCalledWith('moyu')
    })
  })

  describe('search action', () => {
    it('hides the search icon while the query is empty', () => {
      const { container } = setup({ query: '' })

      expect(container.querySelector('svg')).not.toBeInTheDocument()
    })

    it('triggers a search when the icon is clicked', async () => {
      const { user, container, handleSearchClick } = setup({ query: 'cube' })

      await user.click(container.querySelector('svg') as SVGElement)

      expect(handleSearchClick).toHaveBeenCalledTimes(1)
    })

    it('triggers a search when Enter is pressed inside the input', async () => {
      const { user, handleSearchClick } = setup({ query: 'cube' })

      await user.type(screen.getByRole('textbox'), '{Enter}')

      expect(handleSearchClick).toHaveBeenCalledTimes(1)
    })

    it('stops listening for Enter after unmount', async () => {
      const { user, unmount, handleSearchClick } = setup({ query: 'cube' })
      const input = screen.getByRole('textbox')

      unmount()
      document.body.appendChild(input)
      await user.type(input, '{Enter}')

      expect(handleSearchClick).not.toHaveBeenCalled()
    })
  })
})
