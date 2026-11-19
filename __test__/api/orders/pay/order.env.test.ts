jest.mock('@/lib/auth/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}))

jest.mock('@/lib/models/order', () => ({
  __esModule: true,
  default: {},
}))

jest.mock('@/lib/models/product', () => ({
  __esModule: true,
  default: {},
}))

jest.mock('@/lib/responseHandler', () => ({
  __esModule: true,
  default: {},
}))

jest.mock('stripe', () => ({
  __esModule: true,
  default: jest.fn(),
}))

describe('Stripe environment variables', () => {
  const originalStripeKey = process.env.STRIPE_SECRET_KEY

  afterEach(() => {
    jest.resetModules()

    if (originalStripeKey === undefined) {
      delete process.env.STRIPE_SECRET_KEY
    } else {
      process.env.STRIPE_SECRET_KEY = originalStripeKey
    }
  })

  it('should throw an error when STRIPE_SECRET_KEY is missing', async () => {
    delete process.env.STRIPE_SECRET_KEY

    jest.resetModules()

    await expect(import('@/app/api/orders/pay/[id]/route')).rejects.toThrow(
      'STRIPE_SECRET_KEY is missing from environment variables.',
    )
  })
})
