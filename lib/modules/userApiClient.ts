import { BASE_URL, usersEndpoints } from '../constants'

export const userApi = {
  getList: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/${usersEndpoints.list}`, {
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
  userInfo: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${usersEndpoints.info(id)}`, {
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
  orders: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${usersEndpoints.orders(id)}`, {
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
