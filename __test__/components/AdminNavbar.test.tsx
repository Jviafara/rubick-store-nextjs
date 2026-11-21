import { mockUser } from '@/__mocks__/users.mock'
import AdminNavbar from '@/components/AdminNavbar'
import { useSession } from '@/lib/auth/auth-client'
import { act, fireEvent, render, screen } from '@testing-library/react'

const mockSession = useSession as jest.Mock

jest.mock('@/lib/auth/auth-client', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/components/Logo', () => ({
  __esModule: true,
  default: () => <div data-testid='logo' />,
}))

jest.mock('@/components/UserMenu', () => ({
  __esModule: true,
  default: ({ open, toggleMenu }: { open: boolean; toggleMenu: () => void }) => (
    <div data-testid='user-menu-modal'>
      <h1 data-testid='user-menu'>{open ? 'Open' : 'Closed'}</h1>
      <button
        data-test-id='toogle-button'
        onClick={toggleMenu}
      >
        toogle menu
      </button>
    </div>
  ),
}))

describe('Admin navbar component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
    mockSession.mockReturnValue({
      data: { user: mockUser },
      pending: false,
    })
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
    jest.restoreAllMocks()
  })

  it('should render admin navbar', async () => {
    render(<AdminNavbar />)

    expect(screen.getByTestId('logo')).toBeInTheDocument()
  })

  it('clears the active timeout when the menu is manually closed before 5 seconds', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    render(<AdminNavbar />)
    const trigger = screen.getByText('JESUS')

    // 1. Open menu -> schedules 5000ms timeout
    fireEvent.click(trigger)
    expect(screen.getByTestId('user-menu')).toHaveTextContent('Open')

    const menuTimerCall = setTimeoutSpy.mock.calls.find(([, delay]) => delay === 5000)
    const menuTimerId = setTimeoutSpy.mock.results[setTimeoutSpy.mock.calls.indexOf(menuTimerCall!)]?.value

    // 2. Advance 2 seconds, then manually close -> triggers clearUserMenuTimeout()
    act(() => {
      jest.advanceTimersByTime(2000)
    })
    fireEvent.click(trigger)

    expect(screen.getByTestId('user-menu')).toHaveTextContent('Closed')
    expect(clearTimeoutSpy).toHaveBeenCalledWith(menuTimerId)

    // 3. Re-open and advance past the original 5s mark (2000 + 3500 = 5500ms)
    fireEvent.click(trigger)
    act(() => {
      jest.advanceTimersByTime(3500)
    })

    // Still Open because old 5s timer was cleared and new timer only has 3.5s elapsed
    expect(screen.getByTestId('user-menu')).toHaveTextContent('Open')

    // 4. Advance remaining 1500ms -> new 5s timer expires and closes menu
    act(() => {
      jest.advanceTimersByTime(1500)
    })
    expect(screen.getByTestId('user-menu')).toHaveTextContent('Closed')
  })

  it('does not call clearTimeout on first open when no timeout is active', () => {
    const setTimeoutSpy = jest.spyOn(global, 'setTimeout')
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')

    render(<AdminNavbar />)
    const trigger = screen.getByText('JESUS')

    // Clear any internal React render calls before clicking
    setTimeoutSpy.mockClear()
    clearTimeoutSpy.mockClear()

    fireEvent.click(trigger)

    // Verify the 5000ms timer was created, and its ID was NOT cleared
    const menuTimerCall = setTimeoutSpy.mock.calls.find(([, delay]) => delay === 5000)
    const menuTimerId = setTimeoutSpy.mock.results[setTimeoutSpy.mock.calls.indexOf(menuTimerCall!)]?.value

    expect(menuTimerId).toBeDefined()
    expect(clearTimeoutSpy).not.toHaveBeenCalledWith(menuTimerId)
  })
})
