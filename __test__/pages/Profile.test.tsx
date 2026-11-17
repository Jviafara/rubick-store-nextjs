import ProfilePage from '@/app/(user pages)/profile/page'
import { useSession } from '@/lib/auth/auth-client'
import { render, screen } from '@testing-library/react'
import { useRouter, useSearchParams } from 'next/navigation'

const mockUseSession = useSession as jest.Mock
const mockRouter = useRouter as jest.Mock
const mockSearchParams = useSearchParams as jest.Mock
const mockReplace = jest.fn()
const mockSPget = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
}))

jest.mock('@/lib/auth/auth-client', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/components/UserProfileSidebar', () => ({
  __esModule: true,
  default: () => <div data-testid='user-profile-sidebar' />,
}))
jest.mock('@/components/UserInfo', () => ({
  __esModule: true,
  default: () => <div data-testid='user-info' />,
}))
jest.mock('@/components/FavoritesGrid', () => ({
  __esModule: true,
  default: () => <div data-testid='favorites' />,
}))
jest.mock('@/components/OrderList', () => ({
  __esModule: true,
  default: () => <div data-testid='orders' />,
}))
jest.mock('@/components/CommingSoon', () => ({
  __esModule: true,
  default: () => <div data-testid='reviews' />,
}))

describe('Profile page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRouter.mockReturnValue({ replace: mockReplace })
    mockSearchParams.mockReturnValue({ get: mockSPget })
    mockUseSession.mockReturnValue({
      data: { user: { id: 1, name: 'Jesus' } },
      pending: false,
    })
  })
  it('should render profile page', () => {
    render(<ProfilePage />)
    expect(screen.getByTestId('user-profile-sidebar')).toBeInTheDocument()
  })

  it('should not render profile page when user is loading', () => {
    mockUseSession.mockReturnValue({
      data: undefined,
      pending: true,
    })
    render(<ProfilePage />)
    expect(screen.queryByTestId('user-profile-sidebar')).not.toBeInTheDocument()
  })

  it('should not render profile page to unauthenticated users', () => {
    mockUseSession.mockReturnValue({
      data: null,
      pending: false,
    })
    render(<ProfilePage />)
    expect(screen.queryByTestId('user-profile-sidebar')).not.toBeInTheDocument()
  })

  it('should render user info content when tab = "user-info"', () => {
    mockSPget.mockReturnValue('user-info')
    render(<ProfilePage />)
    expect(screen.getByTestId('user-info')).toBeInTheDocument()
    expect(screen.queryByTestId('favorites')).not.toBeInTheDocument()
    expect(screen.queryByTestId('orders')).not.toBeInTheDocument()
    expect(screen.queryByTestId('reviews')).not.toBeInTheDocument()
  })

  it('should render user info content when tab = "favorites"', () => {
    mockSPget.mockReturnValue('favorites')
    render(<ProfilePage />)
    expect(screen.getByTestId('favorites')).toBeInTheDocument()
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument()
    expect(screen.queryByTestId('orders')).not.toBeInTheDocument()
    expect(screen.queryByTestId('reviews')).not.toBeInTheDocument()
  })

  it('should render user info content when tab = "orders"', () => {
    mockSPget.mockReturnValue('orders')
    render(<ProfilePage />)
    expect(screen.getByTestId('orders')).toBeInTheDocument()
    expect(screen.queryByTestId('favorites')).not.toBeInTheDocument()
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument()
    expect(screen.queryByTestId('reviews')).not.toBeInTheDocument()
  })

  it('should render user info content when tab = "reviews"', () => {
    mockSPget.mockReturnValue('reviews')
    render(<ProfilePage />)
    expect(screen.getByTestId('reviews')).toBeInTheDocument()
    expect(screen.queryByTestId('favorites')).not.toBeInTheDocument()
    expect(screen.queryByTestId('orders')).not.toBeInTheDocument()
    expect(screen.queryByTestId('user-info')).not.toBeInTheDocument()
  })

  it('should redirect to sign-in to unauthenticated users', () => {
    mockUseSession.mockReturnValue({
      data: null,
      pending: false,
    })

    render(<ProfilePage />)
    expect(screen.queryByTestId('user-profile-sidebar')).not.toBeInTheDocument()
    expect(mockReplace).toHaveBeenCalled()
    expect(mockReplace).toHaveBeenCalledWith('/sign-in')
  })

  it('should not call the redirections while the user info is loading to sign-in to unauthenticated users', () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: true,
    })

    render(<ProfilePage />)
    expect(screen.queryByTestId('user-profile-sidebar')).not.toBeInTheDocument()
    expect(mockReplace).not.toHaveBeenCalled()
    expect(mockReplace).not.toHaveBeenCalledWith('/sign-in')
  })

  it('should add the params tab="user-info" if none is passesd', () => {
    mockSPget.mockReturnValue('')
    render(<ProfilePage />)
    expect(screen.queryByTestId('user-profile-sidebar')).toBeInTheDocument()
    expect(mockReplace).toHaveBeenCalled()
    expect(mockReplace).toHaveBeenCalledWith('/profile?tab=user-info')
  })
})
