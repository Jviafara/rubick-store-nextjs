export const mockProduct = {
  _id: 'product-123',
  name: 'Mechanical Keyboard',
  slug: 'mechanical-keyboard',
  category: 'Electronics',
  images: ['/images/keyboard.webp'],
  price: 150,
  countInStock: 20,
  brand: 'Keychron',
  rating: 4.8,
  numReviews: 25,
  description: 'Wireless mechanical keyboard with RGB lighting.',
  totalSold: 120,
  createdAt: new Date('2026-01-10'),
  updatedAt: new Date('2026-02-10'),
}

export const mockCartItem = {
  ...mockProduct,
  quantity: 2,
}

export const mockCartItems = [
  mockCartItem,
  {
    _id: 'product-456',
    name: 'Gaming Mouse',
    slug: 'gaming-mouse',
    category: 'Electronics',
    images: ['/images/mouse.webp'],
    price: 75,
    countInStock: 15,
    brand: 'Logitech',
    rating: 4.5,
    numReviews: 18,
    description: 'Ergonomic wireless gaming mouse.',
    totalSold: 85,
    createdAt: new Date('2026-01-15'),
    updatedAt: new Date('2026-02-15'),
    quantity: 1,
  },
]
