import { render, waitFor } from '@testing-library/react'
import { useAppSelector } from '@/lib/hooks/redux.hooks'
import ThemeProvider from '@/app/ThemeProvider'

jest.mock('@/lib/hooks/redux.hooks', () => ({
  useAppSelector: jest.fn(),
}))

const mockUseAppSelector = useAppSelector as unknown as jest.Mock

describe('ThemeProvider', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark')
    jest.clearAllMocks()
  })

  afterEach(() => {
    document.documentElement.classList.remove('dark')
  })

  it('should add the dark class when themeMode is dark', async () => {
    mockUseAppSelector.mockImplementation(selector =>
      selector({
        themeMode: { themeMode: 'dark' },
      }),
    )

    render(<ThemeProvider />)

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark')
    })
  })

  it('should remove the dark class when themeMode is light', async () => {
    document.documentElement.classList.add('dark')

    mockUseAppSelector.mockImplementation(selector =>
      selector({
        themeMode: { themeMode: 'light' },
      }),
    )

    render(<ThemeProvider />)

    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass('dark')
    })
  })

  it('should update the theme when themeMode changes', async () => {
    mockUseAppSelector.mockImplementation(selector =>
      selector({
        themeMode: { themeMode: 'light' },
      }),
    )

    const { rerender } = render(<ThemeProvider />)

    await waitFor(() => {
      expect(document.documentElement).not.toHaveClass('dark')
    })

    mockUseAppSelector.mockImplementation(selector =>
      selector({
        themeMode: { themeMode: 'dark' },
      }),
    )

    rerender(<ThemeProvider />)

    await waitFor(() => {
      expect(document.documentElement).toHaveClass('dark')
    })
  })

  it('should render nothing', () => {
    mockUseAppSelector.mockImplementation(selector =>
      selector({
        themeMode: { themeMode: 'light' },
      }),
    )

    const { container } = render(<ThemeProvider />)

    expect(container).toBeEmptyDOMElement()
  })
})
