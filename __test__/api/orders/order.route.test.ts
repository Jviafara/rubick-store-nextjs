import { mockAddress } from '@/__mocks__/Address.mock'
import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { mockUser, mockUserSession } from '@/__mocks__/users.mock'
import { GET, POST } from '@/app/api/orders/route'
import { auth } from '@/lib/auth/auth'
import Address from '@/lib/models/address'
import Order from '@/lib/models/order'
import connectDB from '@/lib/mongodb'
import { NextRequest } from 'next/server'

const mockAuthSession = jest.mocked(auth.api.getSession) as jest.Mock
const mockAddressFindById = Address.findById as jest.Mock
const mockOrderFind = Order.find as jest.Mock
const mockOrderCreate = Order.create as jest.Mock

const mockNewOrder = {
  orderItems: [{ product: 'prod_123', name: 'Moyu 3x3' }],
  shippingAddress: mockAddress,
  paumentId: '1',
  itemsPrice: 25,
  ShippiongPrice: 3,
  totalPrice: 28,
  user: '1',
}

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
    findById: jest.fn(),
    create: jest.fn(),
  },
}))

jest.mock('@/lib/models/address', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}))

const getRequest = () => GET(new NextRequest(`http://localhost:3000/api/orders`))
const postRequest = (bodyData: Record<string, unknown>) =>
  POST(
    new NextRequest(`http://localhost:3000/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    }),
  )

describe('GET / api/orders', () => {
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

describe('POST / api/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })
    mockAddressFindById.mockResolvedValue(mockAddress)
    mockOrderCreate.mockResolvedValue({
      _id: 'order_123',
      ...mockNewOrder,
    })
  })

  it('should connect to database', async () => {
    await postRequest(mockNewOrder)

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorized to unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await postRequest({})

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return 201 created order', async () => {
    const res = await postRequest(mockNewOrder)

    expect(res.status).toEqual(201)
    await expect(res.json()).resolves.toEqual(
      mockResponseHandler.ok({
        _id: 'order_123',
        ...mockNewOrder,
      }),
    )
  })

  it('should return 400 badRequest if address dont exist', async () => {
    mockAddressFindById.mockResolvedValue(null)
    const res = await postRequest(mockNewOrder)

    expect(res.status).toEqual(400)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.badRequest('Address not found'))
  })

  it('should return 500 error if api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockOrderCreate.mockRejectedValue(new Error('Error'))
    const res = await postRequest({})

    expect(res.status).toEqual(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})
