import SignUp from '@/app/(auth)/sign-up/page'
import { useSession } from '@/lib/auth/auth-client'
import { render, screen } from '@testing-library/react'
import { useRouter } from 'next/navigation'

const mockUseSession = useSession as jest.Mock
const mockPush = jest.fn()
const mockRouter = useRouter as unknown as jest.Mock

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}))

jest.mock('@/components/Logo', () => ({
  __esModule: true,
  default: () => <div data-testid='Logo' />,
  Logo: () => <div data-testid='Logo' />,
}))

jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}))

jest.mock('@/components/SignUpForm', () => ({
  __esModule: true,
  default: () => <div data-testid='sign-up-form' />,
  SignUpForm: () => <div data-testid='sign-up-form' />,
}))

jest.mock('@/lib/auth/auth-client', () => ({
  useSession: jest.fn(),
}))

jest.mock('@/components/GoogleSignIn', () => ({
  __esModule: true,
  default: () => <div data-testid='google-sign-in' />,
  GoogleSignIne: () => <div data-testid='google-sign-in' />,
}))

describe('Sign-up page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseSession.mockReturnValue({
      data: null,
      isPending: false,
    })
    mockRouter.mockReturnValue({
      push: mockPush,
    })
  })

  it('Render Sign-in Page', () => {
    render(<SignUp />)
    expect(screen.getByText('Sign Up')).toBeVisible()
  })

  it('Should redirect to home when user log-in', () => {
    mockUseSession.mockReturnValue({
      data: { id: 1, user: { id: 1, name: 'Jesus' } },
      isPending: false,
    })

    render(<SignUp />)

    expect(mockPush).toHaveBeenCalledWith('/')
    expect(mockPush).toHaveBeenCalledTimes(1)
  })
})
