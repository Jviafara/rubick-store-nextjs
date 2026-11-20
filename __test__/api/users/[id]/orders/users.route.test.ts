import { mockAddress } from '@/__mocks__/Address.mock'
import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { mockUser } from '@/__mocks__/users.mock'
import { GET } from '@/app/api/users/[id]/orders/route'
import { auth } from '@/lib/auth/auth'
import Order from '@/lib/models/order'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import { NextRequest } from 'next/server'

const mockUserFindById = User.findById as jest.Mock
const mockOrderFind = Order.find as jest.Mock
const mockAuthSession = auth.api.getSession as unknown as jest.Mock
const mockSort = jest.fn()
const mockOrder = {
  orderItems: [{ product: 'prod_123', name: 'Moyu 3x3' }],
  shippingAddress: mockAddress,
  paumentId: '1',
  itemsPrice: 25,
  ShippiongPrice: 3,
  totalPrice: 28,
  user: '1',
  createdAt: new Date('2026-01-10').toString(),
}

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/lib/models/user', () => ({
  __esModule: true,
  User: {
    findById: jest.fn(),
  },
}))

jest.mock('@/lib/models/order', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}))

jest.mock('@/lib/auth/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}))

const getRequest = () =>
  GET(new NextRequest('http://localhost:3000/api/users'), { params: Promise.resolve({ id: '1' }) })

describe('GET / api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: { ...mockUser, role: 'admin' },
    })
    mockUserFindById.mockResolvedValue(mockUser)

    mockOrderFind.mockReturnValue({ sort: mockSort })
    mockSort.mockResolvedValue([mockOrder])
  })

  it('should connect to db', async () => {
    await getRequest()

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorize if user is not authenticated', async () => {
    mockAuthSession.mockResolvedValue(null)
    const res = await getRequest()

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return 401 unauthorize if user is not admin', async () => {
    mockAuthSession.mockResolvedValue({
      user: mockUser,
    })
    const res = await getRequest()

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return 404 notFound', async () => {
    mockUserFindById.mockResolvedValue(null)
    const res = await getRequest()

    expect(res.status).toEqual(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should return user and orders', async () => {
    const res = await getRequest()

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ user: mockUser, orders: [mockOrder] }))
  })

  it('should return 500 badRequest when api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockUserFindById.mockRejectedValue(new Error())

    const res = await getRequest()

    expect(res.status).toEqual(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockReset()
  })
})
