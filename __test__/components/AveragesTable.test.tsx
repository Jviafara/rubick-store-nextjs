import AveragesTable from '@/components/AveragesTable'
import { Averages, ISolve } from '@/lib/types'
import { formatearTiempo } from '@/lib/utils'
import { render, screen } from '@testing-library/react'

const mockCurrent = {
  scramble: 'R2 U F2 L',
  time: 11.4,
  mo3: 10.5,
  ao5: 12.4,
  ao12: 12.5,
  ao25: 13.4,
  ao50: 11.6,
  ao100: 10.4,
} as unknown as ISolve

const mockLowest = {
  time: { time: 11.4 },
  mo3: { mo3: 10.5 },
  ao5: { ao5: 12.4 },
  ao12: { ao12: 12.5 },
  ao25: { ao25: 13.4 },
  ao50: { ao50: 11.6 },
  ao100: { ao100: 10.4 },
} as unknown as Averages

const mockClear = jest.fn()

describe('Averages Table', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should render averages table', () => {
    render(
      <AveragesTable
        current={mockCurrent}
        lowests={mockLowest}
        handleClearTimes={mockClear}
      />,
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('if current pass should have clear button', () => {
    render(
      <AveragesTable
        current={mockCurrent}
        lowests={mockLowest}
        handleClearTimes={mockClear}
      />,
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
    const clearButton = screen.getByRole('button', { name: 'clear button' })
    expect(clearButton.querySelector('svg')).toBeInTheDocument()
  })

  it('should not have clear button if timer table is empty', () => {
    render(<AveragesTable handleClearTimes={mockClear} />)
    expect(screen.getByRole('table')).toBeInTheDocument()
    const clearButton = screen.getByRole('button', { name: 'clear button' })
    expect(clearButton.querySelector('svg')).not.toBeInTheDocument()
  })

  it('should show best averages', () => {
    render(
      <AveragesTable
        current={mockCurrent}
        lowests={mockLowest}
        handleClearTimes={mockClear}
      />,
    )

    expect(screen.getByTestId('time')).toHaveTextContent('11.4')
    expect(screen.getByTestId('mo3')).toHaveTextContent('10.5')
    expect(screen.getByTestId('ao5')).toHaveTextContent('12.4')
    expect(screen.getByTestId('ao12')).toHaveTextContent('12.5')
    expect(screen.getByTestId('ao25')).toHaveTextContent('13.4')
    expect(screen.getByTestId('ao50')).toHaveTextContent('11.59')
    expect(screen.getByTestId('ao100')).toHaveTextContent('10.4')
  })

  it('should show "-" when lowset averagesare null or undefined', () => {
    render(
      <AveragesTable
        current={mockCurrent}
        handleClearTimes={mockClear}
      />,
    )

    expect(screen.getByTestId('time')).toHaveTextContent('-')
    expect(screen.getByTestId('mo3')).toHaveTextContent('-')
    expect(screen.getByTestId('ao5')).toHaveTextContent('-')
    expect(screen.getByTestId('ao12')).toHaveTextContent('-')
    expect(screen.getByTestId('ao25')).toHaveTextContent('-')
    expect(screen.getByTestId('ao50')).toHaveTextContent('-')
    expect(screen.getByTestId('ao100')).toHaveTextContent('-')
  })
})
