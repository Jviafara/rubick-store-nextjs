/* eslint-disable @typescript-eslint/no-unused-vars */
import Modal from '@/components/Modal'
import { ModalPositions } from '@/lib/constants'
import type { IModalConfig } from '@/lib/types'
import { fireEvent, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { HTMLAttributes, ReactNode } from 'react'
import { renderWithProviders } from '@/__test__/utils/test-utils'

// Animations are not what is being tested here, so motion components become plain elements.
jest.mock('motion/react', () => ({
  AnimatePresence: ({ children }: { children?: ReactNode }) => <>{children}</>,
  motion: {
    div: ({
      children,
      initial,
      animate,
      exit,
      transition,
      ...rest
    }: HTMLAttributes<HTMLDivElement> & {
      initial?: unknown
      animate?: unknown
      exit?: unknown
      transition?: unknown
    }) => <div {...rest}>{children}</div>,
  },
}))

jest.mock('@/components/Logo', () => ({
  __esModule: true,
  default: () => <span data-testid='logo' />,
}))

const openConfig = (overrides: Partial<IModalConfig> = {}): { modalService: { config: IModalConfig } } => ({
  modalService: {
    config: {
      modalOpen: true,
      header: 'Delete item',
      subTitle: 'This cannot be undone',
      type: '',
      position: ModalPositions.Center,
      children: 'Modal body',
      icon: null,
      logo: false,
      closeButton: true,
      confirmButton: null,
      cancelButton: null,
      ...overrides,
    },
  },
})

describe('Modal', () => {
  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('renders nothing while closed', () => {
    const { container } = renderWithProviders(<Modal />, {
      preloadedState: openConfig({ modalOpen: false }),
    })

    expect(container).toBeEmptyDOMElement()
  })

  it('renders the header, subtitle and content when open', () => {
    renderWithProviders(<Modal />, { preloadedState: openConfig() })

    expect(screen.getByRole('heading', { name: 'Delete item' })).toBeInTheDocument()
    expect(screen.getByText('This cannot be undone')).toBeInTheDocument()
    expect(screen.getByText('Modal body')).toBeInTheDocument()
  })

  it.each([ModalPositions.Center, ModalPositions.Left, ModalPositions.Right])('renders its content at the %s position', position => {
    renderWithProviders(<Modal />, { preloadedState: openConfig({ position }) })

    expect(screen.getByRole('heading', { name: 'Delete item' })).toBeInTheDocument()
    expect(screen.getByText('Modal body')).toBeInTheDocument()
  })

  describe('action buttons', () => {
    it('does not render a footer without confirm or cancel buttons', () => {
      renderWithProviders(<Modal />, { preloadedState: openConfig() })

      // only the close button
      expect(screen.getAllByRole('button')).toHaveLength(1)
    })

    it('runs the confirm and cancel actions', async () => {
      const user = userEvent.setup()
      const confirm = jest.fn()
      const cancel = jest.fn()

      renderWithProviders(<Modal />, {
        preloadedState: openConfig({
          confirmButton: { label: 'Yes, delete', action: confirm },
          cancelButton: { label: 'Keep it', action: cancel },
        }),
      })

      await user.click(screen.getByRole('button', { name: 'Yes, delete' }))
      expect(confirm).toHaveBeenCalledTimes(1)
      expect(cancel).not.toHaveBeenCalled()

      await user.click(screen.getByRole('button', { name: 'Keep it' }))
      expect(cancel).toHaveBeenCalledTimes(1)
    })
  })

  describe('closing', () => {
    it('closes when the close button is clicked', async () => {
      const user = userEvent.setup()
      const { store } = renderWithProviders(<Modal />, { preloadedState: openConfig() })

      await user.click(screen.getByRole('button'))

      expect(store.getState().modalService.config.modalOpen).toBe(false)
      expect(screen.queryByText('Modal body')).not.toBeInTheDocument()
    })

    it('hides the close button when closeButton is false', () => {
      renderWithProviders(<Modal />, { preloadedState: openConfig({ closeButton: false }) })

      expect(screen.queryByRole('button')).not.toBeInTheDocument()
    })

    it('closes when the overlay is clicked', () => {
      const { container, store } = renderWithProviders(<Modal />, { preloadedState: openConfig() })

      fireEvent.click(container.firstChild as Element)

      expect(store.getState().modalService.config.modalOpen).toBe(false)
    })

    it('stays open when the modal content itself is clicked', async () => {
      const user = userEvent.setup()
      const { store } = renderWithProviders(<Modal />, { preloadedState: openConfig() })

      await user.click(screen.getByText('Modal body'))

      expect(store.getState().modalService.config.modalOpen).toBe(true)
      expect(screen.getByText('Modal body')).toBeInTheDocument()
    })
  })

  it('shows a logo linking home when logo is enabled', () => {
    renderWithProviders(<Modal />, { preloadedState: openConfig({ logo: true }) })

    expect(screen.getByTestId('logo')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/')
  })

  it('does not show the logo by default', () => {
    renderWithProviders(<Modal />, { preloadedState: openConfig() })

    expect(screen.queryByTestId('logo')).not.toBeInTheDocument()
  })

  it('locks page scrolling while open and releases it when closed', async () => {
    const user = userEvent.setup()
    renderWithProviders(<Modal />, { preloadedState: openConfig() })

    expect(document.body.style.overflow).toBe('hidden')

    await user.click(screen.getByRole('button'))

    expect(document.body.style.overflow).not.toBe('hidden')
  })
})
