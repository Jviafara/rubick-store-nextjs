/**
 * @jest-environment node
 */
import { GET } from '@/app/api/products/route'
import Product from '@/lib/models/product'
import connectDB from '@/lib/mongodb'
import { NextRequest } from 'next/server'

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/lib/models/product', () => ({
  __esModule: true,
  default: { aggregate: jest.fn(), countDocuments: jest.fn() },
}))

const aggregate = Product.aggregate as unknown as jest.Mock
const countDocuments = Product.countDocuments as unknown as jest.Mock

const request = (queryString = '') => GET(new NextRequest(`http://localhost:3000/api/products${queryString}`))

const pipelineOfFirstCall = () => aggregate.mock.calls[0][0] as Record<string, any>[] // eslint-disable-line @typescript-eslint/no-explicit-any

describe('GET /api/products', () => {
  beforeEach(() => {
    aggregate.mockResolvedValue([{ name: 'MoYu RS3M' }])
    countDocuments.mockResolvedValue(1)
  })

  it('connects to the database', async () => {
    await request()

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('returns 404 when no products match', async () => {
    aggregate.mockResolvedValue([])

    const res = await request()

    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual({ status: 404, message: 'Resource Not Found' })
    expect(countDocuments).not.toHaveBeenCalled()
  })

  it('returns 404 when a search has no results', async () => {
    aggregate.mockResolvedValue([])

    const res = await request('?query=zzz')

    expect(res.status).toBe(404)
  })

  it('returns the products with pagination info', async () => {
    countDocuments.mockResolvedValue(25)

    const res = await request('?page=2&page_size=10')
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.products).toEqual([{ name: 'MoYu RS3M' }])
    expect(body.pagination).toEqual({
      currentPage: 2,
      pageSize: 10,
      total: 25,
      totalPages: 3,
      hasNextPage: true,
      hasPrevPage: true,
    })
  })

  it('reports no next page on the last page and no previous page on the first', async () => {
    countDocuments.mockResolvedValue(25)

    const last = (await (await request('?page=3&page_size=10')).json()).pagination
    expect(last.hasNextPage).toBe(false)
    expect(last.hasPrevPage).toBe(true)

    const first = (await (await request('?page=1&page_size=10')).json()).pagination
    expect(first.hasNextPage).toBe(true)
    expect(first.hasPrevPage).toBe(false)
  })

  it('defaults to page 1 with 12 products per page', async () => {
    await request()

    expect(pipelineOfFirstCall()).toEqual(expect.arrayContaining([{ $skip: 0 }, { $limit: 12 }]))
  })

  it('computes skip and limit from the page and page size', async () => {
    await request('?page=3&page_size=5')

    expect(pipelineOfFirstCall()).toEqual(expect.arrayContaining([{ $skip: 10 }, { $limit: 5 }]))
  })

  it('never goes below page 1', async () => {
    const res = await request('?page=-4')
    const body = await res.json()

    expect(body.pagination.currentPage).toBe(1)
    expect(pipelineOfFirstCall()).toEqual(expect.arrayContaining([{ $skip: 0 }]))
  })

  it('filters by a case-insensitive name search', async () => {
    await request('?query=cube')

    expect(pipelineOfFirstCall()[0].$match.name).toEqual({ $regex: 'cube', $options: 'i' })
  })

  it('filters by category', async () => {
    await request('?filter=3x3')

    expect(pipelineOfFirstCall()[0].$match.$and).toEqual(expect.arrayContaining([{ category: '3x3' }]))
  })

  it('does not restrict the category for "All products"', async () => {
    await request('?filter=All%20products')

    expect(pipelineOfFirstCall()[0].$match.$and).toEqual(expect.arrayContaining([{ category: { $exists: true } }]))
  })

  it('filters by price range', async () => {
    await request('?price_min=10&price_max=50')

    expect(pipelineOfFirstCall()[0].$match.$and).toEqual(expect.arrayContaining([{ price: { $gte: 10 } }, { price: { $lte: 50 } }]))
  })

  it('sorts out-of-stock products last, then by the requested order', async () => {
    await request(`?sort_by=${encodeURIComponent('Lower to Higher')}`)

    const sortStage = pipelineOfFirstCall().find(stage => '$sort' in stage)

    expect(sortStage).toEqual({ $sort: { isOutOfStock: 1, price: 1 } })
  })

  it('returns 400 with the error message when the database fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    aggregate.mockRejectedValue(new Error('db down'))

    const res = await request()
    const body = await res.json()

    expect(res.status).toBe(400)
    expect(body.message).toContain('db down')

    consoleError.mockRestore()
  })
})
