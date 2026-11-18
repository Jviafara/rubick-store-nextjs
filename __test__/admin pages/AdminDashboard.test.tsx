import DashBoard from '@/app/admin/dashboard/page'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

jest.mock('@/components/AdminSideBar', () => ({
  __esModule: true,
  default: ({ setView }: { setView: (val: string) => void }) => (
    <div data-testid='admin-sidebar'>
      <button onClick={() => setView('orders')}>change view</button>
    </div>
  ),
}))

jest.mock('@/components/UserList', () => ({
  __esModule: true,
  default: () => <div data-testid='user-list' />,
}))

jest.mock('framer-motion', () => ({
  motion: {
    h1: ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => <div {...props}>{children}</div>,
  },
}))

describe('Admin Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the admin dashboard', () => {
    render(<DashBoard />)

    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('should change successfully change the mainview', async () => {
    const user = userEvent.setup()
    render(<DashBoard />)

    expect(screen.getByTestId('user-list')).toBeInTheDocument()

    const mainViewButton = screen.getByRole('button', { name: 'change view' })
    expect(mainViewButton).toBeInTheDocument()
    await user.click(mainViewButton)

    expect(screen.queryByTestId('user-list')).not.toBeInTheDocument()
    expect(screen.getByText(/hola/i)).toBeInTheDocument()
  })
})
