import ThemeButton from '@/components/ThemeButton'
import { renderWithProviders } from '@/__test__/utils/test-utils'
import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('ThemeButton', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('switches from dark to light and persists the choice', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<ThemeButton />, { preloadedState: { themeMode: { themeMode: 'dark' } } })

    await user.click(screen.getByRole('button'))

    expect(store.getState().themeMode.themeMode).toBe('light')
    expect(localStorage.getItem('themeMode')).toBe('light')
  })

  it('switches from light back to dark', async () => {
    const user = userEvent.setup()
    const { store } = renderWithProviders(<ThemeButton />, { preloadedState: { themeMode: { themeMode: 'light' } } })

    await user.click(screen.getByRole('button'))

    expect(store.getState().themeMode.themeMode).toBe('dark')
    expect(localStorage.getItem('themeMode')).toBe('dark')
  })

  it('changes its icon when the theme changes', async () => {
    const user = userEvent.setup()
    const { container } = renderWithProviders(<ThemeButton />)
    const before = container.innerHTML

    await user.click(screen.getByRole('button'))

    expect(container.innerHTML).not.toBe(before)
  })
})
