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
      console.error(error)
      return { error }
    }
  },
}
