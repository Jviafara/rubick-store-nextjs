import { BASE_URL } from '@/lib/constants'
import favoriteApi from '@/lib/modules/favoriteApiClient'

const mockFetch = jest.fn()

const jsonResponse = (payload: unknown) => ({ json: jest.fn().mockResolvedValue(payload) })

const headers = { 'Content-Type': 'application/json' }

beforeEach(() => {
  global.fetch = mockFetch as unknown as typeof fetch
})

describe('favoriteApi', () => {
  describe('getList', () => {
    it('requests the favorites with the given query string', async () => {
      const payload = [{ product: 'p1' }]
      mockFetch.mockResolvedValue(jsonResponse(payload))

      const result = await favoriteApi.getList('?page=1')

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/favorites?page=1`, { headers })
      expect(result).toEqual({ res: payload })
    })

    it('returns a message and the error when the request fails', async () => {
      const err = new Error('network down')
      mockFetch.mockRejectedValue(err)

      await expect(favoriteApi.getList()).resolves.toEqual({ message: 'Failed to fetch the favorite!', err })
    })
  })

  describe('add', () => {
    it('POSTs the product id', async () => {
      mockFetch.mockResolvedValue(jsonResponse({ _id: 'fav-1' }))

      const result = await favoriteApi.add('p1')

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/favorites`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ productId: 'p1' }),
      })
      expect(result).toEqual({ res: { _id: 'fav-1' } })
    })

    it('returns a message when the request fails', async () => {
      mockFetch.mockRejectedValue(new Error('boom'))

      await expect(favoriteApi.add('p1')).resolves.toMatchObject({ message: 'Failed to Create the favorite!' })
    })
  })

  describe('remove', () => {
    it('DELETEs the favorite by id', async () => {
      mockFetch.mockResolvedValue(jsonResponse({ status: 200 }))

      const result = await favoriteApi.remove('fav-1')

      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/api/favorites`, {
        method: 'DELETE',
        headers,
        body: JSON.stringify({ favoriteId: 'fav-1' }),
      })
      expect(result).toEqual({ res: { status: 200 } })
    })

    it('returns a message when the request fails', async () => {
      mockFetch.mockRejectedValue(new Error('boom'))

      await expect(favoriteApi.remove('fav-1')).resolves.toMatchObject({ message: 'Failed to delete the favorite!' })
    })
  })
})
