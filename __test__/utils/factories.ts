import type { ICartItem, IFavorite, IProduct } from '@/lib/types'

// The app types extend mongoose `Document`, so test data is cast once here instead of in every test.
export const makeProduct = (overrides: Record<string, unknown> = {}): IProduct =>
  ({
    _id: 'prod-1',
    name: 'MoYu RS3M',
    slug: 'moyu-rs3m',
    category: '3x3',
    images: ['/images/moyu-rs3m.png'],
    price: 19,
    countInStock: 10,
    brand: 'MoYu',
    rating: 4.5,
    numReviews: 12,
    description: 'A fast and smooth speed cube.',
    totalSold: 100,
    ...overrides,
  }) as unknown as IProduct

export const makeCartItem = (overrides: Record<string, unknown> = {}): ICartItem =>
  ({ ...makeProduct(), quantity: 1, ...overrides }) as unknown as ICartItem

export const makeFavorite = (productId = 'prod-1'): IFavorite => ({ _id: `fav-${productId}`, product: productId, user: 'user-1' }) as unknown as IFavorite
