import TimerPage from '@/app/(store pages)/timer/page'
import { addNewSolve, formatearTiempo } from '@/lib/utils'
import { act, fireEvent, render, screen } from '@testing-library/react'

const mockedFormatearTiempo = formatearTiempo as jest.Mock

const keyDown = (key = ' ') => fireEvent.keyDown(document, { key })
const keyUp = (key = ' ') => fireEvent.keyUp(document, { key })

jest.mock('@/components/SolvesHistory', () => ({
  __esModule: true,
  default: ({ time }: { time: number }) => <div data-testid='solves-history'>Last time: {time}</div>,
}))

jest.mock('@/components/CubeScrambler', () => ({
  __esModule: true,
  default: ({ setScramble }: { setScramble: (s: string) => void }) => (
    <div data-testid='cube-scrambler'>
      <button
        type='button'
        onClick={() => setScramble("R U R' U'")}
      >
        Generate Scramble
      </button>
    </div>
  ),
}))

jest.mock('@/lib/utils', () => ({
  addNewSolve: jest.fn(),
  formatearTiempo: jest.fn((mode, segundos, timeLeft) => {
    if (mode === 'sec') return `Inspection: ${timeLeft}`
    return `${segundos.toFixed(2)}`
  }),
}))

describe('initial render', () => {
  it('shows the desktop-only message and icon', () => {
    render(<TimerPage />)
    expect(screen.getByText(/available on desktop or bigger screens/i)).toBeInTheDocument()
  })

  it('renders the scrambler, history and a stopped 0 time', () => {
    render(<TimerPage />)
    expect(screen.getByTestId('cube-scrambler')).toBeInTheDocument()
    expect(screen.getByTestId('solves-history')).toHaveTextContent('0')
    expect(mockedFormatearTiempo).toHaveBeenCalledWith('stop', 0)
    expect(screen.getByText(/0.00/i)).toBeInTheDocument()
  })

  it('does not show the +2 penalty', () => {
    render(<TimerPage />)
    expect(screen.queryByText('+2')).not.toBeInTheDocument()
  })
})

describe('Timer Functionalities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('ignores non-spacebar keys', () => {
    render(<TimerPage />)

    keyDown('Enter')
    keyUp('Enter')

    expect(screen.getByTestId('cube-scrambler')).toBeInTheDocument()
  })

  it('starts inspection countdown on first spacebar press and release', () => {
    render(<TimerPage />)

    keyDown()
    keyUp()

    expect(screen.queryByTestId('cube-scrambler')).not.toBeInTheDocument()
    expect(screen.getByText('Inspection: 15')).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    expect(screen.getByText('Inspection: 12')).toBeInTheDocument()
  })

  it('requires holding spacebar for 300ms during inspection before starting the solve timer', () => {
    render(<TimerPage />)

    keyDown()
    keyUp()

    keyDown()
    act(() => {
      jest.advanceTimersByTime(150)
    })
    keyUp()
    expect(screen.getByText('Inspection: 15')).toBeInTheDocument()

    keyDown()
    keyDown()

    act(() => {
      jest.advanceTimersByTime(300)
    })

    const timerDisplay = screen.getByText('Inspection: 15')
    expect(timerDisplay).toHaveClass('text-green-500!')

    keyUp()

    act(() => {
      jest.advanceTimersByTime(1250)
    })

    expect(formatearTiempo).toHaveBeenCalledWith('running', expect.closeTo(1.25, 1))
  })

  it('applies a +2 penalty if inspection reaches 0 before starting', () => {
    render(<TimerPage />)

    // Start inspection
    keyDown()
    keyUp()
    // Exhaust all 15 seconds of inspection
    act(() => {
      jest.advanceTimersByTime(15000)
    })

    expect(screen.getByText('+2')).toBeInTheDocument()

    // Hold 300ms and release to start timer with +2s penalty
    fireEvent.keyDown(document, { key: ' ' })
    act(() => {
      jest.advanceTimersByTime(300)
    })
    fireEvent.keyUp(document, { key: ' ' })

    // Timer starts at 2.00s instead of 0.00s
    expect(formatearTiempo).toHaveBeenCalledWith('running', 2)
  })

  it('stops timer on spacebar release, saves the solve with scramble, and updates history', async () => {
    render(<TimerPage />)

    // Set a scramble via mocked child
    fireEvent.click(screen.getByRole('button', { name: /generate scramble/i }))

    // 1. Start inspection
    keyDown()
    keyUp()

    // 2. Hold 300ms and release to start solve
    keyDown()
    act(() => {
      jest.advanceTimersByTime(300)
    })
    keyUp()

    // 3. Run timer for 2 seconds
    act(() => {
      jest.advanceTimersByTime(2000)
    })

    // 4. Press & release spacebar to stop solve
    keyDown()
    await act(async () => {
      keyUp()
    })

    expect(addNewSolve).toHaveBeenCalledWith(expect.closeTo(2.0, 1), "R U R' U'")
    expect(screen.getByTestId('cube-scrambler')).toBeInTheDocument()
    expect(screen.getByTestId('solves-history')).toHaveTextContent(/Last time: 2/)
  })

  it('clears pending ready timeout when spacebar is released before 300ms', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    render(<TimerPage />)

    // 1. Start inspection first so the next Spacebar press schedules the 300ms ready timeout
    keyDown()
    keyUp()

    // 2. Press Spacebar (sets timerRef.current), advance 100ms, then release early
    keyDown()
    act(() => {
      jest.advanceTimersByTime(100)
    })
    keyUp()

    // Verifies cleanupLongPress() cleared the active timerRef.current
    expect(clearTimeoutSpy).toHaveBeenCalled()

    // Advancing the remaining 200ms should NOT turn the timer green (ready remains false)
    act(() => {
      jest.advanceTimersByTime(200)
    })
    expect(screen.getByText('Inspection: 15')).not.toHaveClass('text-green-500!')

    clearTimeoutSpy.mockRestore()
  })

  it('clears pending ready timeout when component unmounts while spacebar is held', () => {
    const clearTimeoutSpy = jest.spyOn(global, 'clearTimeout')
    const { unmount } = render(<TimerPage />)

    // Hold Spacebar down so timerRef.current is populated
    fireEvent.keyDown(document, { key: ' ' })
    act(() => {
      jest.advanceTimersByTime(100)
    })

    // Unmount before 300ms completes to trigger the useEffect cleanup branch
    unmount()

    expect(clearTimeoutSpy).toHaveBeenCalled()
    clearTimeoutSpy.mockRestore()
  })
})
