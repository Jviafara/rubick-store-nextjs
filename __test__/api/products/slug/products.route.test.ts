import { mockProduct } from '@/__mocks__/products.mock'
import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { GET } from '@/app/api/products/slug/[slug]/route'
import Product from '@/lib/models/product'
import connectDB from '@/lib/mongodb'
import { NextRequest } from 'next/server'

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/lib/models/product', () => ({
  __esModule: true,
  default: { findOne: jest.fn() },
}))

const mocKProductFindOne = Product.findOne as unknown as jest.Mock

const request = (slug = '') =>
  GET(new NextRequest(`http://localhost:3000/api/products/slug/${slug}`), {
    params: Promise.resolve({ slug }),
  })

describe('GET /api/products', () => {
  beforeEach(() => {
    mocKProductFindOne.mockResolvedValue({ ...mockProduct })
  })

  it('connects to the database', async () => {
    await request('moyu-3x3')

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('returns 404 when no products match', async () => {
    mocKProductFindOne.mockResolvedValue(null)

    const res = await request('moyu-3x3')

    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual({ status: 404, message: 'Resource Not Found' })
  })

  it('returns the product info ', async () => {
    const res = await request('moyu-3x3')

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ ...mockProduct }))
  })

  it('returns 400 badRequest when api call fails ', async () => {
    mocKProductFindOne.mockRejectedValue(new Error())

    const res = await request('moyu-3x3')

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.badRequest('Error'))
  })

  it('returns 400 badRequest with default message', async () => {
    mocKProductFindOne.mockRejectedValue(null)

    const res = await request('moyu-3x3')

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.badRequest('Error al buscar los productos'))
  })
})
