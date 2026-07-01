import { BASE_URL, orderEndpoints } from '../constants'

export const OrdersApi = {
  getList: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/${orderEndpoints.list}`, {
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
  getListUser: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/${orderEndpoints.userList}`, {
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
