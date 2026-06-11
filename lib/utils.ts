import { IProduct } from './types'
export const getDate = (product: IProduct) => {
  const date = new Date(product.createdAt || '')
  return date
}
