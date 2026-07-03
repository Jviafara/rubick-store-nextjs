import { BASE_URL, favoriteEndpoints } from '../constants'

const favoriteApi = {
  getList: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/${favoriteEndpoints.list}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const res = await response.json()
      return { res }
    } catch (err) {
      return { message: 'Failed to fetch the favorite!', err }
    }
  },
  add: async (productId: string) => {
    const body = { productId }
    try {
      const response = await fetch(`${BASE_URL}/api/${favoriteEndpoints.add}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const res = await response.json()
      return { res }
    } catch (err) {
      return { message: 'Failed to Create the favorite!', err }
    }
  },
  remove: async (favoriteId: string) => {
    const body = { favoriteId }
    try {
      const response = await fetch(`${BASE_URL}/api/${favoriteEndpoints.remove}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      const res = await response.json()
      return { res }
    } catch (err) {
      return { message: 'Failed to delete the favorite!', err }
    }
  },
}

export default favoriteApi
