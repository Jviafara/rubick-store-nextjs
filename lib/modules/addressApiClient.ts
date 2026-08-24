import { addressEndpoints, BASE_URL } from '../constants'
import { CreateAddressProps, UpdateAddressProps } from '../types'

export const AddressApi = {
  create: async ({ name, address, city, phone, country, postalCode, isDefault }: CreateAddressProps) => {
    const body = {
      name,
      address,
      city,
      phone,
      country,
      postalCode,
      isDefault,
    }
    try {
      const response = await fetch(`${BASE_URL}/api/${addressEndpoints.create}`, {
        method: 'POST',
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
  list: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/${addressEndpoints.list}`, {
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
  byId: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${addressEndpoints.byId(id)}`, {
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
  default: async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/${addressEndpoints.default}`, {
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
  update: async ({ id, name, address, city, phone, country, postalCode }: UpdateAddressProps) => {
    const body = {
      name,
      address,
      city,
      phone,
      country,
      postalCode,
    }
    try {
      const response = await fetch(`${BASE_URL}/api/${addressEndpoints.update(id)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...body }),
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      console.error(error)
      return { error }
    }
  },
  delete: async (id: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${addressEndpoints.delete(id)}`, {
        method: 'DELETE',
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
