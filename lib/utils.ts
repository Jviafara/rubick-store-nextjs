import { IOrder, IProduct } from './types'
export const getDate = (product: IProduct | IOrder) => {
  const date = new Date(product.createdAt || '')
  return date
}
