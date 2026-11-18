import AdminLayout from '@/app/admin/layout'
import StoreProvider from '@/app/admin/StoreProvider'
import ToastProvider from '@/app/admin/ToastProvider'

jest.mock('@/app/admin/StoreProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid='store-provider'>{children}</div>,
}))

jest.mock('@/app/admin/ToastProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid='toast-provider'>{children}</div>,
}))

jest.mock('@/components/AdminNavbar', () => ({
  __esModule: true,
  default: () => <div data-testid='admin-navbar' />,
}))

jest.mock('@/components/GlobalLoading', () => ({
  __esModule: true,
  default: () => <div data-testid='global-loading' />,
}))

jest.mock('react-toastify', () => ({
  __esModule: true,
  default: () => <div data-testid='toast-container' />,
  ToastContainer: () => <div data-testid='toast-container' />,
}))

describe('Admin Layout', () => {
  it('renders the Layout structure', () => {
    const children = <div>Children Component</div>
    const layout = AdminLayout({ children })

    expect(layout.type).toBe('section')
  })

  it('renders the application providers', () => {
    const children = <div>Children Component</div>
    const layout = AdminLayout({ children })

    const storeProv = layout.props.children

    expect(storeProv.type).toBe(StoreProvider)
    expect(storeProv.props.children.type).toBe(ToastProvider)
  })
})
