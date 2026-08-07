import { BASE_URL, productsEndpoints } from '../constants'

export const productApi = {
  getList: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/${productsEndpoints.list}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      return { error }
    }
  },
  getQueryList: async (query: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${productsEndpoints.querySearch(query)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      return { error }
    }
  },
  productInfo: async (slug: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${productsEndpoints.info(slug)}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      return { error }
    }
  },
}
