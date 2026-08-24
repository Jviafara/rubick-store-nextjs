import { BASE_URL, usersEndpoints } from '../constants'
import { UpdatePasswordProps, UpdateUserProps } from '../types'

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
  update: async ({ id, body, defaultAddress }: UpdateUserProps) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${usersEndpoints.update(id)}?default-address=${defaultAddress}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      console.error(error)
      return { error }
    }
  },
  updatePassword: async ({ id, body }: UpdatePasswordProps) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${usersEndpoints.updatePassword(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      console.error(error)
      return { error }
    }
  },
}
