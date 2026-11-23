import AppShell from '@/components/AppShell'
import { useWindowHeight } from '@/lib/hooks/useWindowHeight'
import { fireEvent, render, screen } from '@testing-library/react'
import { usePathname } from 'next/navigation'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('@/lib/hooks/useWindowHeight', () => ({
  useWindowHeight: jest.fn(),
}))

jest.mock('@/components/Navbar', () => ({
  __esModule: true,
  default: () => <div data-testid='navbar' />,
}))

jest.mock('@/components/GlobalLoading', () => ({
  __esModule: true,
  default: () => <div data-testid='global-loading' />,
}))

jest.mock('@/components/Modal', () => ({
  __esModule: true,
  default: () => <div data-testid='modal' />,
}))

jest.mock('@/components/ScrollUpButton', () => ({
  __esModule: true,
  default: () => <div data-testid='scroll-up-button' />,
}))

jest.mock('react-toastify', () => ({
  ToastContainer: () => <div data-testid='toast-container' />,
}))

const mockUsePathname = usePathname as jest.Mock
const mockUseWindowHeight = useWindowHeight as jest.Mock

const setScrollY = (value: number) => {
  Object.defineProperty(window, 'scrollY', {
    value,
    writable: true,
    configurable: true,
  })
  fireEvent.scroll(window)
}

describe('AppShell', () => {
  const children = <div>Children Component</div>
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePathname.mockReturnValue('/')
    mockUseWindowHeight.mockReturnValue(800)

    render(<AppShell>{children}</AppShell>)
  })

  it('should render app shell component', () => {
    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByTestId('global-loading')).toBeInTheDocument()
    expect(screen.getByTestId('toast-container')).toBeInTheDocument()
    expect(screen.getByTestId('modal')).toBeInTheDocument()
    expect(screen.getByText('Children Component')).toBeInTheDocument()
  })

  it('renders the navbar inside a header and children inside main', () => {
    expect(screen.getByRole('banner')).toContainElement(screen.getByTestId('navbar'))
    expect(screen.getByRole('main')).toContainElement(screen.getByText('Children Component'))
  })

  it('treats a null pathname as a non-admin route', () => {
    mockUsePathname.mockReturnValue(null)

    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByText('Children Component')).toBeInTheDocument()
  })

  it('treats a undefined pathname as a non-admin route', () => {
    mockUsePathname.mockReturnValue(undefined)

    expect(screen.getByTestId('navbar')).toBeInTheDocument()
    expect(screen.getByText('Children Component')).toBeInTheDocument()
  })
})

describe('admin routes', () => {
  it.each(['/admin', '/admin/products', '/admin/orders/123'])('renders only the children on %s', path => {
    mockUsePathname.mockReturnValue(path)

    render(
      <AppShell>
        <p>admin content</p>
      </AppShell>,
    )

    expect(screen.getByText('admin content')).toBeInTheDocument()
    expect(screen.queryByTestId('navbar')).not.toBeInTheDocument()
    expect(screen.queryByTestId('global-loading')).not.toBeInTheDocument()
    expect(screen.queryByTestId('toast-container')).not.toBeInTheDocument()
    expect(screen.queryByTestId('modal')).not.toBeInTheDocument()
    expect(screen.queryByRole('main')).not.toBeInTheDocument()
  })

  it('does not treat paths that merely contain "admin" as admin routes', () => {
    mockUsePathname.mockReturnValue('/store/admin')

    render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    )

    expect(screen.getByTestId('navbar')).toBeInTheDocument()
  })
})

describe('scroll up button', () => {
  it('is hidden on initial render', () => {
    render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    )

    expect(screen.queryByTestId('scroll-up-button')).not.toBeInTheDocument()
  })

  it('stays hidden when scrollY equals half the window height', () => {
    render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    )

    setScrollY(400)

    expect(screen.queryByTestId('scroll-up-button')).not.toBeInTheDocument()
  })

  it('appears once scrollY passes half the window height', () => {
    render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    )

    setScrollY(401)

    expect(screen.getByTestId('scroll-up-button')).toBeInTheDocument()
  })

  it('disappears again when scrolling back to the top', () => {
    render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    )

    setScrollY(900)
    expect(screen.getByTestId('scroll-up-button')).toBeInTheDocument()

    setScrollY(0)
    expect(screen.queryByTestId('scroll-up-button')).not.toBeInTheDocument()
  })

  it('falls back to a 1080px window height when the hook returns 0', () => {
    mockUseWindowHeight.mockReturnValue(0)

    render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    )

    setScrollY(540)
    expect(screen.queryByTestId('scroll-up-button')).not.toBeInTheDocument()

    setScrollY(541)
    expect(screen.getByTestId('scroll-up-button')).toBeInTheDocument()
  })
})

describe('scroll listener', () => {
  it('registers a scroll listener on mount', () => {
    const addSpy = jest.spyOn(window, 'addEventListener')

    render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    )

    expect(addSpy).toHaveBeenCalledWith('scroll', expect.any(Function))
  })

  it('removes the same scroll listener on unmount', () => {
    const addSpy = jest.spyOn(window, 'addEventListener')
    const removeSpy = jest.spyOn(window, 'removeEventListener')

    const { unmount } = render(
      <AppShell>
        <p>page content</p>
      </AppShell>,
    )

    const handler = addSpy.mock.calls.find(([event]) => event === 'scroll')?.[1]

    unmount()

    expect(removeSpy).toHaveBeenCalledWith('scroll', handler)
  })
})
