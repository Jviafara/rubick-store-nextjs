import TutorialsPage from '@/app/(store pages)/tutorials/page'
import { render, screen } from '@testing-library/react'

jest.mock('@/components/TutorialSlide', () => ({
  __esModule: true,
  default: () => <div data-testid='tutorial-slide' />,
}))

jest.mock('@/components/Container', () => ({
  __esModule: true,
  default: ({ header }: { header: string }) => (
    <div data-testid='container'>
      <div data-testid='container-header'>{header}</div>
    </div>
  ),
}))

describe('Tutorials', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render the tutorial page whit title "Tutorials"', () => {
    render(<TutorialsPage />)

    expect(screen.getByTestId('container')).toBeInTheDocument()
    expect(screen.getByTestId(/container-header/i)).toHaveTextContent('tutorials')
  })
})
