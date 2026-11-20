import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { mockUser, mockUserSession } from '@/__mocks__/users.mock'
import { GET } from '@/app/api/orders/user/route'
import { auth } from '@/lib/auth/auth'
import Order from '@/lib/models/order'
import connectDB from '@/lib/mongodb'
import { NextRequest } from 'next/server'

const mockAuthSession = jest.mocked(auth.api.getSession) as jest.Mock
const mockOrderFind = Order.find as jest.Mock

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

jest.mock('@/lib/models/order', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
  },
}))

const getRequest = () => GET(new NextRequest(`http://localhost:3000/api/orders/user`))

describe('GET / api/orders/user', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })
    mockOrderFind.mockResolvedValue([{ _id: 'order_123', products: [{ _id: 'prod_123', name: 'Moyu 3x3' }] }])
  })

  it('should connect to database', async () => {
    await getRequest()

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorized to unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await getRequest()

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return order list', async () => {
    const res = await getRequest()

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(
      mockResponseHandler.ok([{ _id: 'order_123', products: [{ _id: 'prod_123', name: 'Moyu 3x3' }] }]),
    )
  })

  it('should return 404 notFound if no order are found', async () => {
    mockOrderFind.mockResolvedValue(null)
    const res = await getRequest()

    expect(res.status).toEqual(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should return 500 error if api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockOrderFind.mockRejectedValue(new Error('Error'))
    const res = await getRequest()

    expect(res.status).toEqual(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})
