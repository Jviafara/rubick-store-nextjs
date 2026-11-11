import { SortByEnum } from '@/lib/constants'
import type { IOrder, IProduct, ISolve } from '@/lib/types'
import {
  addNewSolve,
  calcSolvesAverages,
  clearSolveHistory,
  findHighest,
  findLowest,
  formatearTiempo,
  getDate,
  getParamsString,
  getRamdomInt,
  getSolves,
  getSortRule,
  getStripe,
  removeSolve,
} from '@/lib/utils'
import { loadStripe } from '@stripe/stripe-js'
import { toast } from 'react-toastify'

jest.mock('react-toastify', () => ({
  toast: { error: jest.fn(), success: jest.fn() },
}))

jest.mock('@stripe/stripe-js', () => ({
  loadStripe: jest.fn(),
}))

const mockFetch = jest.fn()

const solvesFromTimes = (times: number[]) => times.map(time => ({ time })) as unknown as ISolve[]

beforeEach(() => {
  global.fetch = mockFetch as unknown as typeof fetch
})

describe('formatearTiempo', () => {
  describe('running timer (one decimal)', () => {
    it.each([
      [0, '0.0'],
      [7.5, '7.5'],
      [12.5, '12.5'],
      [65.5, '01:5.5'],
    ])('formats %p seconds as %p', (seconds, expected) => {
      expect(formatearTiempo('running', seconds)).toBe(expected)
    })
  })

  describe('stopped timer (two decimals)', () => {
    it.each([
      [0.5, '0.50'],
      [7.25, '7.25'],
      [12.5, '12.50'],
      [75.5, '01:15.50'],
    ])('formats %p seconds as %p', (seconds, expected) => {
      expect(formatearTiempo('stop', seconds)).toBe(expected)
    })
  })

  describe('countdown (inspection time)', () => {
    it.each([
      [5, '05'],
      [30, '30'],
      [65, '05'],
    ])('formats %p seconds left as %p', (timeLeft, expected) => {
      expect(formatearTiempo('countdown', 0, timeLeft)).toBe(expected)
    })
  })
})

describe('calcSolvesAverages', () => {
  it('returns no averages with fewer than 3 solves', () => {
    expect(calcSolvesAverages(solvesFromTimes([10, 11]))).toEqual({
      mo3: undefined,
      ao5: undefined,
      ao12: undefined,
      ao25: undefined,
      ao50: undefined,
      ao100: undefined,
    })
  })

  it('calculates mo3 as the mean of the last three solves', () => {
    const { mo3, ao5 } = calcSolvesAverages(solvesFromTimes([3, 1, 2]))

    expect(mo3).toBe(2)
    expect(ao5).toBeUndefined()
  })

  it('calculates ao5 by dropping the best and worst of the last five solves', () => {
    const { mo3, ao5, ao12 } = calcSolvesAverages(solvesFromTimes([9, 3, 3, 6, 1]))

    expect(mo3).toBe(5) // (9 + 3 + 3) / 3
    expect(ao5).toBe(4) // sorted 1,3,3,6,9 -> (3 + 3 + 6) / 3
    expect(ao12).toBeUndefined()
  })

  it('calculates ao12 by dropping the best and worst of the last twelve solves', () => {
    const { mo3, ao5, ao12 } = calcSolvesAverages(solvesFromTimes([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]))

    expect(mo3).toBe(2)
    expect(ao5).toBe(3)
    expect(ao12).toBe(6.5) // (2 + ... + 11) / 10
  })

  it('does not mutate the solves it receives', () => {
    const solves = solvesFromTimes([9, 3, 3, 6, 1])

    calcSolvesAverages(solves)

    expect(solves.map(s => s.time)).toEqual([9, 3, 3, 6, 1])
  })

  it.todo('calculates ao25, ao50 and ao100 from the last 25, 50 and 100 solves')
})

describe('findLowest / findHighest', () => {
  const solves = [{ time: 12, mo3: 11 }, { time: 9, mo3: 10, ao5: 9.5 }, { time: 15 }] as unknown as ISolve[]

  it('findLowest returns the solve with the lowest value for each metric', () => {
    const lowest = findLowest(solves)

    expect(lowest.time).toBe(solves[1])
    expect(lowest.mo3).toBe(solves[1])
    expect(lowest.ao5).toBe(solves[1])
  })

  it('findLowest falls back to the first solve when no solve has that metric', () => {
    expect(findLowest(solves).ao12).toBe(solves[0])
  })

  it('findHighest returns the solve with the highest value for each metric', () => {
    const highest = findHighest(solves)

    expect(highest.time).toBe(solves[2])
    expect(highest.mo3).toBe(solves[0])
    expect(highest.ao5).toBe(solves[1])
  })

  it('returns the only solve when there is just one', () => {
    const [only] = solvesFromTimes([8.5])

    expect(findLowest([only]).time).toBe(only)
    expect(findHighest([only]).time).toBe(only)
  })
})

describe('getParamsString', () => {
  it('uses defaults when no params are provided', () => {
    expect(getParamsString({})).toBe('?query=&page=1&page_size=10&filter=All products&price_min=0&price_max=Infinity&sort_by=undefined')
  })

  it('builds the query string from the provided params', () => {
    expect(
      getParamsString({
        query: 'cube',
        page: '2',
        pageSize: '20',
        filter: '3x3',
        priceFilter: [10, 50],
        sortBy: 'Latest',
      }),
    ).toBe('?query=cube&page=2&page_size=20&filter=3x3&price_min=10&price_max=50&sort_by=Latest')
  })

  it('supports an open-ended upper price limit', () => {
    expect(getParamsString({ priceFilter: [100, Infinity], sortBy: 'Latest' })).toContain('price_min=100&price_max=Infinity')
  })
})

describe('getSortRule', () => {
  it.each([
    [SortByEnum.lower_higher, { price: 1 }],
    [SortByEnum.higher_lower, { price: -1 }],
    [SortByEnum.latest, { createdAt: -1 }],
    [SortByEnum.top_rated, { rating: -1 }],
    [SortByEnum.best_sellers, { totalSold: -1 }],
  ])('maps "%s" to %p', (sortBy, expected) => {
    expect(JSON.parse(getSortRule(sortBy))).toEqual(expected)
  })

  it('falls back to newest first, in-stock first for unknown values', () => {
    expect(JSON.parse(getSortRule('something else'))).toEqual({ createdAt: -1, countInStock: -1 })
  })
})

describe('getRamdomInt', () => {
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('returns the minimum when Math.random returns 0', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0)

    expect(getRamdomInt(1, 6)).toBe(1)
  })

  it('returns the maximum when Math.random is just below 1', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0.999999)

    expect(getRamdomInt(1, 6)).toBe(6)
  })

  it('returns that number when min and max are equal', () => {
    expect(getRamdomInt(4, 4)).toBe(4)
  })

  it('always stays within the range', () => {
    for (let i = 0; i < 200; i++) {
      const value = getRamdomInt(3, 8)

      expect(Number.isInteger(value)).toBe(true)
      expect(value).toBeGreaterThanOrEqual(3)
      expect(value).toBeLessThanOrEqual(8)
    }
  })

  it('rounds fractional bounds inwards', () => {
    jest.spyOn(Math, 'random').mockReturnValue(0)
    expect(getRamdomInt(1.2, 3.8)).toBe(2)

    jest.spyOn(Math, 'random').mockReturnValue(0.999999)
    expect(getRamdomInt(1.2, 3.8)).toBe(3)
  })
})

describe('getDate', () => {
  it('returns the createdAt value as a Date', () => {
    const createdAt = new Date('2024-01-15T10:00:00.000Z')

    const result = getDate({ createdAt } as unknown as IProduct | IOrder)

    expect(result).toBeInstanceOf(Date)
    expect(result.getTime()).toBe(createdAt.getTime())
  })

  it('returns an invalid Date when createdAt is missing', () => {
    const result = getDate({} as unknown as IProduct)

    expect(Number.isNaN(result.getTime())).toBe(true)
  })
})

describe('getStripe', () => {
  it('loads Stripe once with the publishable key and reuses the same promise', async () => {
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = 'pk_test_123'
    jest.mocked(loadStripe).mockResolvedValue({} as never)

    const first = getStripe()
    const second = getStripe()

    expect(first).toBe(second)
    expect(loadStripe).toHaveBeenCalledTimes(1)
    expect(loadStripe).toHaveBeenCalledWith('pk_test_123')
    await expect(first).resolves.toEqual({})
  })
})

describe('solves API helpers', () => {
  let consoleError: jest.SpyInstance

  beforeEach(() => {
    consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleError.mockRestore()
  })

  describe('getSolves', () => {
    it('returns the parsed solves', async () => {
      const data = { solvesHistory: [{ time: 10.5 }] }
      mockFetch.mockResolvedValue({ json: jest.fn().mockResolvedValue(data) })

      await expect(getSolves()).resolves.toEqual(data)
      expect(mockFetch).toHaveBeenCalledWith('/api/solves')
    })

    it('logs the error and returns undefined when the request fails', async () => {
      mockFetch.mockRejectedValue(new Error('network down'))

      await expect(getSolves()).resolves.toBeUndefined()
      expect(consoleError).toHaveBeenCalled()
    })
  })

  describe('addNewSolve', () => {
    it('sends the time and scramble with a PUT request', async () => {
      mockFetch.mockResolvedValue({})

      await addNewSolve(12.5, "R U R' U'")

      expect(mockFetch).toHaveBeenCalledWith('/api/solves', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ time: 12.5, scramble: "R U R' U'" }),
      })
    })

    it('logs the error when the request fails', async () => {
      mockFetch.mockRejectedValue(new Error('network down'))

      await addNewSolve(12.5, 'R U')

      expect(consoleError).toHaveBeenCalled()
    })
  })

  describe('removeSolve', () => {
    it('deletes the solve by id and shows a success toast', async () => {
      mockFetch.mockResolvedValue({})

      await removeSolve('solve-1')

      expect(mockFetch).toHaveBeenCalledWith('/api/solves', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: 'solve-1' }),
      })
      expect(toast.success).toHaveBeenCalledWith('Time removed Successfully!')
    })

    it('does not show a success toast when the request fails', async () => {
      mockFetch.mockRejectedValue(new Error('network down'))

      await removeSolve('solve-1')

      expect(toast.success).not.toHaveBeenCalled()
      expect(consoleError).toHaveBeenCalled()
    })
  })

  describe('clearSolveHistory', () => {
    it('sends a clear request and shows a success toast', async () => {
      mockFetch.mockResolvedValue({})

      await clearSolveHistory()

      expect(mockFetch).toHaveBeenCalledWith('/api/solves', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'clear' }),
      })
      expect(toast.success).toHaveBeenCalledWith('History clear Successfully!')
    })

    it('does not show a success toast when the request fails', async () => {
      mockFetch.mockRejectedValue(new Error('network down'))

      await clearSolveHistory()

      expect(toast.success).not.toHaveBeenCalled()
    })
  })
})
