import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { mockUser } from '@/__mocks__/users.mock'
import { GET, PUT, DELETE } from '@/app/api/solves/route'
import { auth } from '@/lib/auth/auth'
import Solves from '@/lib/models/solves'
import connectDB from '@/lib/mongodb'
import { calcSolvesAverages } from '@/lib/utils'
import { NextRequest } from 'next/server'

const mockAuthSession = jest.mocked(auth.api.getSession) as jest.Mock
const mockSolveFindOne = Solves.findOne as jest.Mock
const mockSolveCreate = Solves.create as jest.Mock
const mockCalcAverages = calcSolvesAverages as jest.Mock

const mockSolve = { _id: '1', user: '1', solvesHistory: [{ _id: '1', scramble: 'R U 2F', time: 12 }] }

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/lib/auth/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}))

jest.mock('@/lib/models/solves', () => ({
  __esModule: true,
  default: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}))

jest.mock('@/lib/utils', () => ({ calcSolvesAverages: jest.fn() }))

const getRequest = () => GET(new NextRequest(`http://localhost:3000/api/solves`))
const putRequest = (body: unknown) =>
  PUT(
    new NextRequest(`http://localhost:3000/api/solves`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }),
  )
const deleteRequest = (body: unknown) =>
  DELETE(
    new NextRequest(`http://localhost:3000/api/solves`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }),
  )

describe('GET / api/solves', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
    })
    mockSolveFindOne.mockResolvedValue(mockSolve)
  })

  it('should connect to db', async () => {
    await getRequest()

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorize to unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
    })
    const res = await getRequest()

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return solves', async () => {
    const res = await getRequest()

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok(mockSolve))
  })

  it('should create and return solves if solves didnt exist', async () => {
    mockSolveFindOne.mockResolvedValue(null)
    mockSolveCreate.mockResolvedValue(mockSolve)

    const res = await getRequest()

    expect(res.status).toEqual(201)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.created(mockSolve))
  })

  it('should  return 500 error if api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSolveFindOne.mockRejectedValue(new Error())

    const res = await getRequest()

    expect(res.status).toEqual(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})

describe('PUT / api/solves', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
    })
    mockSolveFindOne.mockResolvedValue({ ...structuredClone(mockSolve), save: jest.fn() })
    mockCalcAverages.mockResolvedValue({ time: 12.3, ao5: 10, ao12: 11 })
  })
  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should connect to db', async () => {
    await putRequest({ scramble: 'R U 2F ', time: 10 })

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorize to unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
    })
    const res = await putRequest({ scramble: 'R U 2F', time: 10 })

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return updated solves', async () => {
    const res = await putRequest({ scramble: 'R U 2F 2B', time: 10 })
    const body = await res.json()

    expect(res.status).toEqual(200)
    expect(body).toEqual(
      mockResponseHandler.ok({
        ...mockSolve,
        solvesHistory: [{ scramble: 'R U 2F 2B', time: 10 }, ...mockSolve.solvesHistory],
      }),
    )
  })

  it('should  return 500 error if api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSolveFindOne.mockRejectedValue(new Error())

    const res = await putRequest({ scramble: 'R U 2F', time: 10 })

    expect(res.status).toEqual(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})

describe('DELETE / api/solves', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
    })
    mockSolveFindOne.mockResolvedValue({
      ...structuredClone(mockSolve),
      solvesHistory: [
        { _id: '1', scramble: 'R U 2F', time: 12 },
        { _id: '2', scramble: 'R U 2F', time: 12 },
      ],
      save: jest.fn(),
    })
    mockCalcAverages.mockResolvedValue({ time: 12.3, ao5: 10, ao12: 11 })
  })

  it('should connect to db', async () => {
    await deleteRequest({ id: 1, type: 'clear' })

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorize to unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
    })
    const res = await deleteRequest({ id: 1 })

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return solves whit a cleared solveHistory', async () => {
    const res = await deleteRequest({ id: 1, type: 'clear' })

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ ...mockSolve, solvesHistory: [] }))
  })

  it('should return solves whit a filtered solvesHistory', async () => {
    const res = await deleteRequest({ id: '1' })

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(
      mockResponseHandler.ok({
        ...mockSolve,
        solvesHistory: [{ _id: '2', scramble: 'R U 2F', time: 12 }],
      }),
    )
  })

  it('should  return 500 error if api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockSolveFindOne.mockRejectedValue(new Error())

    const res = await deleteRequest({ id: '1' })

    expect(res.status).toEqual(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})
