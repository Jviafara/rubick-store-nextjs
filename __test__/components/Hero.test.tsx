import Hero from '@/components/Hero'
import { render, screen } from '@testing-library/react'

jest.mock('@/components/RubiksCube', () => ({
  __esModule: true,
  default: () => <div data-testid='rubiks-cube' />,
  RubiksCube: () => <div data-testid='rubiks-cube' />,
}))

describe('Hero section', () => {
  it('renders the hero section', () => {
    render(<Hero />)

    expect(screen.getByTestId('rubiks-cube')).toBeInTheDocument()
  })
})
