import { render, screen } from '@testing-library/react'
import { useSession } from '@/lib/auth/auth-client'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import ToastProvider from '@/app/admin/ToastProvider'

const mockReplace = jest.fn()

const mockUseSession = useSession as jest.Mock
const mockRouter = useRouter as jest.Mock

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

mockRouter.mockReturnValue({
  replace: mockReplace,
})

jest.mock('react-toastify', () => ({
  __esModule: true,
  default: () => <div data-testid='toast-container' />,
  ToastContainer: () => <div data-testid='toast-container' />,
  toast: { error: jest.fn(), success: jest.fn() },
}))

jest.mock('@/lib/auth/auth-client', () => ({
  useSession: jest.fn(),
}))

describe('Admin Toast Provider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({
      data: { user: { id: '1', name: 'Jesus', role: 'admin' } },
      isPending: false,
    })
  })

  it('renders children', async () => {
    render(
      <ToastProvider>
        <div>Children component</div>
      </ToastProvider>,
    )

    expect(screen.getByText('Children component')).toBeInTheDocument()
  })

  it('should redirect to sign-in for unauthenticated users', () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
    })

    render(
      <ToastProvider>
        <div>Children component</div>
      </ToastProvider>,
    )

    expect(mockReplace).toHaveBeenCalledWith('/sign-in')
  })

  it('should redirect to sign-in for unauthenticated users', () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
    })

    render(
      <ToastProvider>
        <div>Children component</div>
      </ToastProvider>,
    )

    expect(mockReplace).toHaveBeenCalledWith('/sign-in')
  })

  it('should redirect to home for non admin users', () => {
    mockUseSession.mockReturnValue({
      data: { user: { id: '1', name: 'Jesus', role: 'user' } },
      isPending: false,
    })

    render(
      <ToastProvider>
        <div>Children component</div>
      </ToastProvider>,
    )

    expect(mockReplace).toHaveBeenCalledWith('/')
    expect(toast.error).toHaveBeenCalledWith('You are not authorized to view this page')
  })

  it('should not to redirect when user session is still loading', () => {
    mockUseSession.mockReturnValue({
      data: null,
      isPending: true,
    })

    render(
      <ToastProvider>
        <div>Children component</div>
      </ToastProvider>,
    )

    expect(mockReplace).not.toHaveBeenCalled()
    expect(toast.error).not.toHaveBeenCalled()
  })
})
