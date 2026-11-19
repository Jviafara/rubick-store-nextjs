process.env.STRIPE_SECRET_KEY = 'sk_test_fake_secret_key'

import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { mockUser, mockUserSession } from '@/__mocks__/users.mock'
import { POST } from '@/app/api/orders/pay/[id]/route'
import { auth } from '@/lib/auth/auth'
import Order from '@/lib/models/order'
import Product from '@/lib/models/product'
import { NextRequest } from 'next/server'
import Stripe from 'stripe'

const mockAuthSession = jest.mocked(auth.api.getSession) as jest.Mock
const mockOrderFindById = Order.findById as jest.Mock
const mockProductFindById = Product.findById as jest.Mock
const mockedStripe = Stripe as unknown as jest.Mock

const mockStripeInstance = mockedStripe.mock.results[0]?.value

const mockOrder = {
  _id: 'order123',
  orderItems: [
    {
      _id: 'product123',
      quantity: 2,
    },
  ],
  paymentId: '',
  isPaid: false,
  paidAt: undefined,
  save: jest.fn(),
}

const mockProductDocument = {
  _id: 'product123',
  countInStock: 10,
  totalSold: 5,
  save: jest.fn(),
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

jest.mock('@/lib/models/product', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}))

jest.mock('stripe', () => {
  const mockStripe = {
    paymentIntents: {
      create: jest.fn(),
    },
  }

  return jest.fn(() => mockStripe)
})

const postRequest = (bodyData: Record<string, unknown>) =>
  POST(
    new NextRequest(`http://localhost:3000/api/orders/pay/123`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    }),
    {
      params: Promise.resolve({ id: '123' }),
    },
  )

describe('POST / api/orders/pay/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })

    mockOrder.save.mockResolvedValue(mockOrder)
    mockProductDocument.save.mockResolvedValue(mockProductDocument)

    mockOrderFindById.mockResolvedValue(mockOrder)
    mockProductFindById.mockResolvedValue(mockProductDocument)
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

  it('should create a payment intent successfully', async () => {
    mockStripeInstance.paymentIntents.create.mockResolvedValue({
      client_secret: 'secret_123',
    })

    const res = await postRequest({
      type: 'payment_intent',
      amount: 1000,
    })

    expect(mockStripeInstance.paymentIntents.create).toHaveBeenCalledWith({
      amount: 1000,
      currency: 'usd',
      automatic_payment_methods: {
        enabled: true,
      },
    })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(
      mockResponseHandler.ok({
        clientSecret: 'secret_123',
      }),
    )
  })

  it('should handle Stripe errors', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()
    mockStripeInstance.paymentIntents.create.mockRejectedValue(new Error('Stripe error'))

    const res = await postRequest({
      type: 'payment_intent',
      amount: 1000,
    })

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleSpy.mockRestore()
  })

  it('should return not found when order does not exist', async () => {
    mockOrderFindById.mockResolvedValue(null)

    const res = await postRequest({
      type: 'payment_confirmation',
      paymentId: 'payment123',
    })

    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should confirm payment and update order successfully', async () => {
    const res = await postRequest({
      type: 'payment_confirmation',
      paymentId: 'payment123',
    })

    expect(Order.findById).toHaveBeenCalledWith('123')

    expect(Product.findById).toHaveBeenCalledWith('product123')

    expect(mockProductDocument.countInStock).toBe(8)
    expect(mockProductDocument.totalSold).toBe(7)

    expect(mockProductDocument.save).toHaveBeenCalled()
    expect(mockOrder.paymentId).toBe('payment123')
    expect(mockOrder.isPaid).toBe(true)
    expect(mockOrder.paidAt).toBeDefined()
    expect(mockOrder.save).toHaveBeenCalled()

    expect(res.status).toBe(200)
  })

  it('should return OK when payment type is invalid', async () => {
    const res = await postRequest({
      type: 'invalid_type',
    })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ ok: 'OK' }))
  })

  it('should return error when Order.findById throws', async () => {
    mockOrderFindById.mockRejectedValue(new Error('Database error'))

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

    const res = await postRequest({
      type: 'payment_confirmation',
      paymentId: 'payment123',
    })

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleSpy.mockRestore()
  })
})
