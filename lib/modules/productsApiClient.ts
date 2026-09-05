import { BASE_URL, productsEndpoints } from '../constants'
import { CreateProductProps, IProduct } from '../types'

export const productApi = {
  getList: async (params?: string) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${productsEndpoints.list(params ?? '')}`, {
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
  create: async (product: CreateProductProps) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${productsEndpoints.add}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(product),
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      return { error }
    }
  },
  update: async (product: IProduct) => {
    try {
      const response = await fetch(`${BASE_URL}/api/${productsEndpoints.update(product._id.toString())}`, {
        headers: {
          'Content-Type': 'application/json',
        },
        method: 'PUT',
        body: JSON.stringify(product),
      })
      const res = await response.json()
      return { res }
    } catch (error) {
      return { error }
    }
  },
}
