import * as Yup from 'yup'
export const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

export const productsEndpoints = {
  list: (params: string) => `products${params}`,
  add: 'products',
  remove: (productId: string) => `products/${productId}`,
  info: (slug: string) => `products/slug/${slug}`,
  infoById: (productId: string) => `products/${productId}`,
  update: (productId: string) => `products/${productId}`,
  addImages: (productId: string) => `products/images/${productId}`,
}

export const usersEndpoints = {
  list: 'users',
  remove: (userId: string) => `users/${userId}`,
  info: (userId: string) => `users/${userId}`,
  update: (userId: string) => `users/${userId}`,
  updatePassword: (userId: string) => `users/${userId}`,
  orders: (userId: string) => `users/${userId}/orders`,
}

export const favoriteEndpoints = {
  list: (params: string) => `favorites${params}`,
  add: 'favorites',
  remove: 'favorites',
}

export const orderEndpoints = {
  list: 'orders',
  userList: 'orders/user',
  details: (orderId: string) => `orders/${orderId}`,
  create: 'orders',
  remove: 'orders',
  orderPayment: (orderId?: string) => `orders/pay/${orderId}`,
  update: (orderId: string) => `orders/${orderId}`,
}

export const addressEndpoints = {
  create: 'address',
  list: 'address',
  default: `address?type=${'default'}`,
  byId: (addressId: string) => `address/${addressId}`,
  update: (addressId: string) => `address/${addressId}`,
  delete: (addressId: string) => `address/${addressId}`,
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

export enum userSortBy {
  latest = 'latest',
  oldest = 'oldest',
  alphabetical = 'alphabetical',
}
export enum paymentStatus {
  paid = 'paid',
  unpaid = 'unpaid',
}
export enum shippingStatus {
  delivered = 'delivered',
  shipped = 'shipped',
  processing = 'processing',
  cancel = 'cancel',
}

export enum ModalPositions {
  top_center = 'top_center',
  top_left = 'top_left',
  top_right = 'top_right',
  center = 'center',
  left = 'left',
  right = 'right',
  bottom_center = 'bottom_center',
  botom_left = 'bottom_left',
  bottom_right = 'bottom_right',
}

export enum SortByEnum {
  latest = 'Latest',
  top_rated = 'Top rated',
  lower_higher = 'Lower to Higher',
  higher_lower = 'Higher to Lower',
  best_sellers = 'Best Sellers',
}

export const MOVE_CONFIGS: Record<string, boolean> = {
  L: true,
  "L'": true,
  R: true,
  "R'": true,
  U: true,
  "U'": true,
  D: true,
  "D'": true,
  F: true,
  "F'": true,
  B: true,
  "B'": true,
}

export enum ProductCategory {
  TWO_BY_TWO = '2x2',
  THREE_BY_THREE = '3x3',
  FOUR_BY_FOUR = '4x4',
  FIVE_BY_FIVE = '5x5',
  SIX_BY_SIX = '6x6',
  SEVEN_BY_SEVEN = '7x7',
  EIGHT_BY_EIGHT = '8x8',
  PYRAMINX = 'pyraminx',
  MEGAMINX = 'megaminx',
  GIGAMINX = 'gigaminx',
  KILOMINX = 'kilominx',
  SKEWB = 'skewb',
  CLOCK = 'clock',
  MIRROR = 'mirror',
}

export enum ModalPositions {
  Center = 'center',
  Left = 'left',
  Right = 'right',
}

export const colorClasses = {
  primary: {
    border: 'border-primary',
    bg: 'bg-primary/70',
    hoverBg: 'hover:bg-primary',
    hoverBorder: 'hover:border-primary',
  },
  secondary: {
    border: 'border-secondary',
    bg: 'bg-secondary/70',
    hoverBg: 'hover:bg-secondary',
    hoverBorder: 'hover:border-secondary',
  },
  accent: {
    border: 'border-accent',
    bg: 'bg-accent/70',
    hoverBg: 'hover:bg-accent',
    hoverBorder: 'hover:border-accent',
  },
  destructive: {
    border: 'border-destructive',
    bg: 'bg-destructive/70',
    hoverBg: 'hover:bg-destructive',
    hoverBorder: 'hover:border-destructive',
  },
} as const

export const centerAnimations = {
  initial: {
    opacity: 0,
    y: -300,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: 300,
  },
}

export const leftAnimations = {
  initial: {
    opacity: 0,
    x: -300,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: -300,
  },
}

export const rightAnimations = {
  initial: {
    opacity: 0,
    x: 300,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 300,
  },
}

// Yup validation schema
export const validateEditProfile = Yup.object().shape({
  name: Yup.string().required('Full name required'),
  email: Yup.string().email('Invalid email').required('Email required'),
  phone: Yup.string(),
})

export const validateCreatePassword = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password minimum 8 characters')
    .max(16, 'Password maximum 16 characters')
    .required('Password required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .min(8, 'Comfirm password minimum 8 characters')
    .max(16, 'Comfirm password maximum 16 characters')
    .required('Comfirm Password required'),
})

export const validateChangePassword = Yup.object().shape({
  newPassword: Yup.string()
    .min(8, 'Password minimum 8 characters')
    .max(16, 'Password maximum 16 characters')
    .required('Password required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('newPassword')], 'Passwords must match')
    .min(8, 'Comfirm password minimum 8 characters')
    .max(16, 'Comfirm password maximum 16 characters')
    .required('Comfirm Password required'),
  currentPassword: Yup.string()
    .min(8, 'Comfirm password minimum 8 characters')
    .max(16, 'Comfirm password maximum 16 characters')
    .required('Comfirm Password required'),
})
