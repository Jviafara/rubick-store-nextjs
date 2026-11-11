import TimeTable from '@/components/TimeTable'
import type { Averages, ISolves } from '@/lib/types'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const solve = (id: string, time: number, extra: Record<string, unknown> = {}) => ({ _id: id, scramble: "R U R'", time, ...extra })

const solves = {
  solvesHistory: [solve('s1', 12.5, { ao5: 11.75 }), solve('s2', 9.25)],
} as unknown as ISolves

describe('TimeTable', () => {
  it('renders the column headers', () => {
    render(<TimeTable handleDeleteSolve={jest.fn()} />)

    expect(screen.getByRole('columnheader', { name: 'Time' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'ao5' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'ao12' })).toBeInTheDocument()
  })

  it('renders only the header row when there are no solves', () => {
    render(<TimeTable handleDeleteSolve={jest.fn()} />)

    expect(screen.getAllByRole('row')).toHaveLength(1)
  })

  it('renders one row per solve with the formatted time', () => {
    render(
      <TimeTable
        solves={solves}
        handleDeleteSolve={jest.fn()}
      />,
    )

    expect(screen.getAllByRole('row')).toHaveLength(3)
    expect(screen.getByText('12.50')).toBeInTheDocument()
    expect(screen.getByText('9.25')).toBeInTheDocument()
  })

  it('numbers solves from newest (highest) to oldest (1)', () => {
    render(
      <TimeTable
        solves={solves}
        handleDeleteSolve={jest.fn()}
      />,
    )

    const [, firstRow, secondRow] = screen.getAllByRole('row')

    expect(firstRow).toHaveTextContent(/^2/)
    expect(secondRow).toHaveTextContent(/^1/)
  })

  it('shows the ao5 value when it exists and a dash when it does not', () => {
    render(
      <TimeTable
        solves={solves}
        handleDeleteSolve={jest.fn()}
      />,
    )

    expect(screen.getByText('11.75')).toBeInTheDocument()
    // s1 ao12, s2 ao5 and s2 ao12 are missing
    expect(screen.getAllByText('-')).toHaveLength(3)
  })

  it('highlights the best time in green and the worst in red', () => {
    const lowests = { time: { time: 9.25 } } as unknown as Averages
    const highest = { time: { time: 12.5 } } as unknown as Averages

    render(
      <TimeTable
        solves={solves}
        lowests={lowests}
        highest={highest}
        handleDeleteSolve={jest.fn()}
      />,
    )

    expect(screen.getByText('9.25')).toHaveClass('text-green-400')
    expect(screen.getByText('12.50')).toHaveClass('text-red-400')
  })

  it('calls handleDeleteSolve with the id of the solve being deleted', async () => {
    const user = userEvent.setup()
    const handleDeleteSolve = jest.fn()

    render(
      <TimeTable
        solves={solves}
        handleDeleteSolve={handleDeleteSolve}
      />,
    )

    const deleteButtons = screen.getAllByRole('button', { name: 'X' })
    expect(deleteButtons).toHaveLength(2)

    await user.click(deleteButtons[1])

    expect(handleDeleteSolve).toHaveBeenCalledWith('s2')
  })
})
