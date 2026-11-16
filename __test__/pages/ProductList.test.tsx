import ProductsList from '@/app/(store pages)/products/page'
import { ProductFiltersProps } from '@/lib/types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter, useSearchParams } from 'next/navigation'

const mockRouter = useRouter as jest.Mock
const mockPush = jest.fn()
const mockSearchParams = useSearchParams as jest.Mock
const mockSPGet = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

jest.mock('@/components/ProductFilters', () => ({
  __esModule: true,
  default: ({ filter, setFilter, sortBy, setSortBy, setPriceFilter, clearQuery }: ProductFiltersProps) => (
    <div data-testid='product-filters'>
      <span data-testid='current-filter'>{filter}</span>
      <span data-testid='current-sort'>{sortBy}</span>
      <button onClick={() => setFilter('3x3')}>Change Filter</button>
      <button onClick={() => setPriceFilter([10, 50])}>Change Price</button>
      <button onClick={() => setSortBy('price_asc')}>Change Sort</button>
      <button onClick={clearQuery}>Clear Query</button>
    </div>
  ),
}))

jest.mock('@/components/ProductGrid', () => ({
  __esModule: true,
  default: ({ filter, priceFilter, sortBy }: { filter: string; priceFilter: number[]; sortBy: string }) => (
    <div data-testid='product-grid'>
      <span data-testid='grid-filter'>{filter}</span>
      <span data-testid='grid-price'>{priceFilter.join('-')}</span>
      <span data-testid='grid-sort'>{sortBy}</span>
    </div>
  ),
}))

describe('Product list page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRouter.mockReturnValue({ push: mockPush })
    mockSearchParams.mockReturnValue({
      get: mockSPGet,
    })
    mockSPGet.mockReturnValue(null)
  })

  it('should render product list page', () => {
    render(<ProductsList />)

    expect(screen.getByTestId('product-filters')).toBeInTheDocument()
    expect(screen.getByTestId('product-grid')).toBeInTheDocument()
  })

  it('should successfully handle filter change and resets to page 1', async () => {
    const user = userEvent.setup()
    render(<ProductsList />)

    const changeFilterButon = screen.getByRole('button', { name: 'Change Filter' })
    expect(changeFilterButon).toBeInTheDocument()

    await user.click(changeFilterButon)

    expect(screen.getByTestId('grid-filter')).toHaveTextContent('3x3')
    expect(screen.getByTestId('current-filter')).toHaveTextContent('3x3')
    expect(mockPush).toHaveBeenCalledWith('/products?page=1')
  })

  it('should successfully handle price filter change and resets to page 1', async () => {
    const user = userEvent.setup()
    render(<ProductsList />)

    const changePriceFilterButon = screen.getByRole('button', { name: /change price/i })
    expect(changePriceFilterButon).toBeInTheDocument()

    await user.click(changePriceFilterButon)

    expect(screen.getByTestId('grid-price')).toHaveTextContent('10-50')
    expect(mockPush).toHaveBeenCalledWith('/products?page=1')
  })

  it('should successfully handle sort change and resets to page 1', async () => {
    const user = userEvent.setup()
    render(<ProductsList />)

    const changeSortbyButon = screen.getByRole('button', { name: /change sort/i })
    expect(changeSortbyButon).toBeInTheDocument()

    await user.click(changeSortbyButon)

    expect(screen.getByTestId('grid-sort')).toHaveTextContent('price_asc')
    expect(screen.getByTestId('current-sort')).toHaveTextContent('price_asc')
    expect(mockPush).toHaveBeenCalledWith('/products?page=1')
  })

  it('should successfully handle sort change and resets to page 1', async () => {
    const user = userEvent.setup()
    render(<ProductsList />)

    const clearQueryButton = screen.getByRole('button', { name: /clear query/i })
    expect(clearQueryButton).toBeInTheDocument()

    await user.click(clearQueryButton)

    expect(mockPush).toHaveBeenCalledWith('/products')
  })

  it('should set initial sortby from the searchParams', async () => {
    mockSPGet.mockReturnValue('Top rated')
    render(<ProductsList />)

    expect(screen.getByTestId('grid-sort')).toHaveTextContent(/top rated/i)
    expect(screen.getByTestId('current-sort')).toHaveTextContent(/top rated/i)
  })
})
