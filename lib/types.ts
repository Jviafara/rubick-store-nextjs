import mongoose, { Document } from 'mongoose'
import { IconType } from 'react-icons/lib'

export interface userMenuProps {
  open: boolean
  toggleMenu: () => void
}

export interface IMenuConfig {
  display: string
  path: string
  icon: IconType
  state: string
}

export interface ISidebarProps {
  open: boolean
  toggleSidebar: () => void
}

export interface ICart {
  shippingAddress: IShippingAddress
  cartItems: ICartItem[]
}

export interface IFavoriteSlice {
  favoriteList: IFavorite[]
}

export interface ContainerProps {
  header?: string
  children: React.ReactNode
  seeMore?: string
}

export interface IProduct extends Document {
  name: string
  slug: string
  category?: string
  images?: string[]
  price?: number
  countInStock?: number
  brand?: string
  rating?: number
  numReviews?: number
  description?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ICartItem extends IProduct {
  quantity: number
}

export interface ProductSlideProps {
  slideType: string
}

export interface AutoSwiperProps {
  children: React.ReactNode
}
export interface NavigationSwiperProps {
  children: React.ReactNode
}

export interface ProductCardProps {
  product: IProduct
}

export interface IVideo {
  name: string
  id: string
}
export interface mediaVideoProps {
  video: IVideo
}

export interface IFavorite extends Document {
  user: mongoose.Types.ObjectId
  product: mongoose.Types.ObjectId
}

export interface RatingsProps {
  rating?: number
  numReviews?: number
}

export interface SearchBarProps {
  setQuery: (value: string) => void
}

export interface ProductFiltersProps {
  filter: string
  setFilter: (value: string) => void
  setPriceFilter: (value: number[]) => void
  priceSort: string | number[]
  setPriceSort: (value: string) => void
}

export interface ProductGridProps {
  filter: string
  priceFilter: number[]
  priceSort: string
  query: string
}

export interface IOrderItems extends ICartItem {
  product: mongoose.Types.ObjectId
}

export interface IShippingAddress {
  name: string
  address: string
  city: string
  postalCode: string
  country: string
}
export interface IOrder extends Document {
  orderItems: IOrderItems[]
  shippingAddress: IShippingAddress
  paymentId: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  user: mongoose.Types.ObjectId
  isPaid: boolean
  paidAt: Date
  isDelivered: boolean
  deliveredAt: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface OrderPaymentProps {
  orderId: string
  amount: number
  type: string
}

export interface IShippingAddress {
  name: string
  address: string
  city: string
  postalCode: string
  country: string
}

export interface CreateOrderProps {
  shippingAddress: IShippingAddress
  paymentId: string
  itemsPrice: number
  shippingPrice: number
  totalPrice: number
  orderItems: IOrderItems[]
}
