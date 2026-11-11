import { BASE_URL } from '@/lib/constants'
import { productApi } from '@/lib/modules/productsApiClient'

const mockFetch = jest.fn()

const jsonResponse = (payload: unknown) => ({ json: jest.fn().mockResolvedValue(payload) })

const jsonHeaders = { headers: { 'Content-Type': 'application/json' } }

beforeEach(() => {
  global.fetch = mockFetch as unknown as typeof fetch
})

describe('productApi', () => {
  describe('getList', () => {
    it('requests the product list with the given query string', async () => {
      const payload = { products: [{ name: 'MoYu RS3M' }] }
      mockFetch.mockResolvedValue(jsonResponse(payload))

      const result = await productApi.getList('?page=2&page_size=12')

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/products?page=2&page_size=12`, jsonHeaders)
      expect(result).toEqual({ res: payload })
    })

    it('works without a query string', async () => {
      mockFetch.mockResolvedValue(jsonResponse({}))

      await productApi.getList()

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/products`, jsonHeaders)
    })

    it('returns the error when the request fails', async () => {
      const error = new Error('network down')
      mockFetch.mockRejectedValue(error)

      await expect(productApi.getList()).resolves.toEqual({ error })
    })
  })

  describe('productInfo', () => {
    it('requests a product by slug', async () => {
      const payload = { name: 'MoYu RS3M', slug: 'moyu-rs3m' }
      mockFetch.mockResolvedValue(jsonResponse(payload))

      const result = await productApi.productInfo('moyu-rs3m')

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/products/slug/moyu-rs3m`, jsonHeaders)
      expect(result).toEqual({ res: payload })
    })

    it('returns the error when the request fails', async () => {
      const error = new Error('boom')
      mockFetch.mockRejectedValue(error)

      await expect(productApi.productInfo('anything')).resolves.toEqual({ error })
    })
  })
})
