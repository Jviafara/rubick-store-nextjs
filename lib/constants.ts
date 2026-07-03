export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const productsEndpoints = {
  list: 'products',
  add: 'products',
  remove: (productId: string) => `products/${productId}`,
  info: (slug: string) => `products/slug/${slug}`,
  infoById: (productId: string) => `products/${productId}`,
  update: (productId: string) => `products/${productId}`,
  addImages: (productId: string) => `products/images/${productId}`,
}

export const favoriteEndpoints = {
  list: 'favorites',
  add: 'favorites',
  remove: 'favorites',
}

export const orderEndpoints = {
  list: 'orders',
  userList: 'orders/user',
  details: (orderId: string) => `orders/${orderId}`,
  create: 'orders',
  remove: 'orders',
  orderPayment: (orderId: string) => `orders/pay/${orderId}`,
}

export const videos = [
  {
    name: 'Tutorial 3x3',
    id: '7Ron6MN45LY',
  },
  {
    name: 'Tutorial 2x2',
    id: 'GANnG5a19kg',
  },
  {
    name: 'Tutorial 4x4',
    id: 'KWOZHbDdOeo',
  },
  {
    name: 'Tutorial piraminx',
    id: 'v0huoqKcAZw',
  },
  {
    name: 'Tutorial megaminx',
    id: 'oVRooYDvRqg',
  },
]
