import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

jest.mock('@/components/Hero', () => ({
  __esModule: true,
  default: () => <div data-testid='hero' />,
  Hero: () => <div data-testid='hero' />,
}))

jest.mock('@/components/LandingPageSliders', () => ({
  __esModule: true,
  default: () => <div data-testid='landing-page-sliders' />,
  LandingPageSliders: () => <div data-testid='landing-page-sliders' />,
}))

describe('Home Page', () => {
  it('renders the homepage', () => {
    render(<Home />)

    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('landing-page-sliders')).toBeInTheDocument()
  })
})
