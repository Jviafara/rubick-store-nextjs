import RootLayout from '@/app/layout'
import StoreProvider from '@/app/StoreProvider'
import ThemeProvider from '@/app/ThemeProvider'
import ToastProvider from '@/app/ToastProvider'
import AppShell from '@/components/AppShell'

jest.mock('@/app/StoreProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid='store-provider'>{children}</div>,
}))

jest.mock('@/app/ThemeProvider', () => ({
  __esModule: true,
  default: () => <div data-testid='theme-provider' />,
}))

jest.mock('@/app/ToastProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid='toast-provider'>{children}</div>,
}))

jest.mock('@/components/AppShell', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid='app-shell'>{children}</div>,
}))

describe('Root Layout', () => {
  it('renders the HTML document structure', () => {
    const children = <div>Children Component</div>
    const layout = RootLayout({ children })

    expect(layout.type).toBe('html')
    expect(layout.props.lang).toBe('en')

    expect(layout.props.children[0].type).toBe('head')
    expect(layout.props.children[1].type).toBe('body')
  })

  it('renders the application providers', () => {
    const children = <div>Children Component</div>
    const layout = RootLayout({ children })

    const body = layout.props.children[1]

    expect(body.props.children.type).toBe(StoreProvider)
    expect(body.props.children.props.children[0].type).toBe(ThemeProvider)
    expect(body.props.children.props.children[1].type).toBe(ToastProvider)
    expect(body.props.children.props.children[1].props.children.type).toBe(AppShell)
  })
})
