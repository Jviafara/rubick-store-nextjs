import mongoose, { Document } from 'mongoose'
import { IconType } from 'react-icons/lib'
import { ModalPositions, userSortBy } from './constants'
import { RefObject } from 'react'

export interface FullUser extends Document {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  emailVerified: boolean
  name: string
  image?: string | null | undefined
  role: string
  phone: number
  prefix: string
}

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
  type: string
  query?: string
}

export interface ProductFiltersProps {
  filter: string
  setFilter: (value: string) => void
  setPriceFilter: (value: number[]) => void
  sortBy: string
  setSortBy: (value: string) => void
  clearQuery: () => void
}

export interface ProductGridProps {
  filter: string
  priceFilter: number[]
  sortBy: string
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
  shippingStatus: string
  deliveredAt: Date
  createdAt?: Date
  updatedAt?: Date
}

export interface StatusSelectorProps {
  order: IOrder
  setOrders?: React.Dispatch<React.SetStateAction<IOrder[]>>
  setOrder?: React.Dispatch<React.SetStateAction<IOrder | null>>
  useLabel?: boolean
}

export interface OrderPaymentProps {
  orderId: string
  amount: number
  type: string
}
export interface OrderUpdateProps {
  orderId: string
  isPaid?: boolean
  shippingStatus?: string
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

export interface AdminAsideProps {
  mainView: string
  setView: (state: string) => void
}

export interface UserTableProps {
  query: string
  adminFilter: boolean
  sortBy: userSortBy
}

export interface ISugestionSearchBar {
  query: string
  setQuery: React.Dispatch<React.SetStateAction<string>>
  inputRef?: RefObject<HTMLInputElement | null>
}

export interface ImodalSlice {
  modalService: boolean
}

export interface IModalConfig {
  position: ModalPositions
}

export interface ScrambleGeneratorProps {
  scramble: string
  setScramble: React.Dispatch<React.SetStateAction<string>>
  scrambleHistory: string[]
  setScrambleHistory: React.Dispatch<React.SetStateAction<string[]>>
}

export interface ISolve extends Document {
  scramble: string
  time: number
  mo3?: number
  ao5?: number
  ao12?: number
  ao25?: number
  ao50?: number
  ao100?: number
}

export interface ISolves extends Document {
  user: mongoose.Types.ObjectId
  solvesHistory: ISolve[]
}

export interface Averages {
  time: ISolve
  mo3?: ISolve
  ao5?: ISolve
  ao12?: ISolve
  ao25?: ISolve
  ao50?: ISolve
  ao100?: ISolve
}

export interface ProductSearchParamsProps {
  query?: string
  page?: string
  pageSize?: string
  filter?: string
  priceFilter?: number[]
  sortBy?: string
}

export interface IPagination {
  currentPage: number
  pageSize: number
  total: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}
