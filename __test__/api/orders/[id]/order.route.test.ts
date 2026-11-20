import { mockAddress } from '@/__mocks__/Address.mock'
import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { mockUser, mockUserSession } from '@/__mocks__/users.mock'
import { GET, PUT, DELETE } from '@/app/api/orders/[id]/route'
import { auth } from '@/lib/auth/auth'
import Order from '@/lib/models/order'
import connectDB from '@/lib/mongodb'
import { NextRequest } from 'next/server'

const mockAuthSession = jest.mocked(auth.api.getSession) as jest.Mock
const mockOrderFindById = Order.findById as jest.Mock
const mockOrderDelete = Order.findByIdAndDelete as jest.Mock

const mockNewOrder = {
  orderItems: [{ product: 'prod_123', name: 'Moyu 3x3' }],
  shippingAddress: mockAddress,
  paymentId: '1',
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
    findByIdAndDelete: jest.fn(),
  },
}))

jest.mock('@/lib/models/address', () => ({
  __esModule: true,
  default: {
    findById: jest.fn(),
  },
}))

const getRequest = (orderId = '') =>
  GET(new NextRequest(`http://localhost:3000/api/orders/${orderId}`), {
    params: Promise.resolve({ id: orderId }),
  })
const putRequest = (bodyData: Record<string, unknown>, orderId = '') =>
  PUT(
    new NextRequest(`http://localhost:3000/api/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    }),
    {
      params: Promise.resolve({ id: orderId }),
    },
  )

const deleteRequest = (orderId = '') =>
  DELETE(new NextRequest(`http://localhost:3000/api/orders/${orderId}`), {
    params: Promise.resolve({ id: orderId }),
  })

describe('GET / api/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })
    mockOrderFindById.mockResolvedValue({ _id: 'order_123', products: [{ _id: 'prod_123', name: 'Moyu 3x3' }] })
  })

  it('should connect to database', async () => {
    await getRequest('1')

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

  it('should return order', async () => {
    const res = await getRequest('1')

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(
      mockResponseHandler.ok({ _id: 'order_123', products: [{ _id: 'prod_123', name: 'Moyu 3x3' }] }),
    )
  })

  it('should return 404 notFound if no order are found', async () => {
    mockOrderFindById.mockResolvedValue(null)
    const res = await getRequest('1')

    expect(res.status).toEqual(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should return 500 error if api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockOrderFindById.mockRejectedValue(new Error('Error'))
    const res = await getRequest('1')

    expect(res.status).toEqual(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})

describe('PUT / api/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: { ...mockUser, role: 'admin' },
      session: mockUserSession,
    })
    mockOrderFindById.mockResolvedValue({ ...mockNewOrder, save: jest.fn() })
  })

  it('should connect to database', async () => {
    await putRequest(mockNewOrder)

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorized to unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await putRequest({})

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return 200 updated order', async () => {
    const res = await putRequest(mockNewOrder, '1')
    const body = await res.json()

    expect(res.status).toEqual(200)
    expect(body).toEqual(mockResponseHandler.ok(mockNewOrder))
  })

  it('should update the payment status if a new status is passed', async () => {
    const res = await putRequest({ ...mockNewOrder, isPaid: true }, '1')
    const body = await res.json()

    expect(res.status).toEqual(200)
    expect(body).toEqual(mockResponseHandler.ok({ ...mockNewOrder, isPaid: true }))
  })

  it('should return 404 notFound if order dont exist', async () => {
    mockOrderFindById.mockResolvedValue(null)
    const res = await putRequest(mockNewOrder, '1')

    expect(res.status).toEqual(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should return 500 error if api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockOrderFindById.mockRejectedValue(new Error('Error'))
    const res = await putRequest({})

    expect(res.status).toEqual(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})

describe('DELETE / api/orders', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })
    mockOrderFindById.mockResolvedValue({ _id: 'order_123', products: [{ _id: 'prod_123', name: 'Moyu 3x3' }] })
    mockOrderDelete.mockResolvedValue({ success: true })
  })

  it('should connect to database', async () => {
    await deleteRequest('1')

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorized to unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await deleteRequest('1')

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return deleted order id', async () => {
    const res = await deleteRequest('1')

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ _id: '1' }))
  })

  it('should return 404 notFound if no order are found', async () => {
    mockOrderFindById.mockResolvedValue(null)
    const res = await deleteRequest('1')

    expect(res.status).toEqual(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should return 500 error if api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockOrderDelete.mockRejectedValue(new Error('Error'))
    const res = await deleteRequest('1')

    expect(res.status).toEqual(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})
