import mongoose, { Document } from 'mongoose'
import { IconType } from 'react-icons/lib'
import { colorClasses, ModalPositions, userSortBy } from './constants'
import { RefObject } from 'react'
import type { Swiper as SwiperInstance } from 'swiper'

export interface FullUser extends Document {
  id: string
  createdAt: Date
  updatedAt: Date
  email: string
  emailVerified: boolean
  name: string
  image?: string | null | undefined
  role: string
  phone: string
  defaultAddress: mongoose.Types.ObjectId
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
  totalSold?: number
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
  slideNumber?: number
}
export interface NavigationSwiperProps {
  children: React.ReactNode
  onSwiper?: (swiper: SwiperInstance) => void
  onSlideChange?: (swiper: SwiperInstance) => void
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
  totalSold?: number
  type?: string
}

export interface SearchBarProps {
  setQuery: (value: string) => void
  type?: string
  query?: string
  handleSearchClick: () => void
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

export interface IShippingAddress extends Document {
  name: string
  address: string
  city: string
  phone: string
  postalCode: string
  country: string
  user: mongoose.Types.ObjectId
}

export interface CreateAddressProps {
  name: string
  address: string
  city: string
  phone: string
  postalCode: string
  country: string
  isDefault?: boolean
}
export interface UpdateAddressProps extends CreateAddressProps {
  id: string
}
export interface IOrder extends Document {
  orderItems: IOrderItems[]
  shippingAddress: mongoose.Types.ObjectId
  paymentId?: string
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

export interface IFullOrder extends Document {
  orderItems: IOrderItems[]
  shippingAddress: IShippingAddress
  paymentId?: string
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
  order: IFullOrder
  setOrders?: React.Dispatch<React.SetStateAction<IFullOrder[]>>
  setOrder?: React.Dispatch<React.SetStateAction<IFullOrder | null>>
  useLabel?: boolean
}

export interface OrderPaymentProps {
  orderId?: string
  amount: number
  type: string
  paymentId?: string
}

export interface PlaceOrdersProps {
  shippingAddress: mongoose.Types.ObjectId
  itemsPrice: number
  totalPrice: number
  shippingPrice: number
  paymentId: string
  orderItems: IOrderItems[]
}
export interface OrderUpdateProps {
  orderId: string
  isPaid?: boolean
  shippingStatus?: string
}

export interface CreateOrderProps {
  shippingAddress: string
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
  handleSearchClick: () => void
}

export interface ImodalSlice {
  config: IModalConfig
}

export interface IModalConfig {
  modalOpen: boolean
  header?: string
  subTitle?: string
  type?: string
  position: ModalPositions
  children: React.ReactNode | null
  icon: IconType | null
  logo?: boolean
  closeButton?: boolean
  confirmButton: ModalButton | null
  cancelButton: ModalButton | null
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

export type CubeStatus = 'ready' | 'scrambling' | 'solving' | 'solved'

export type BaseMove = 'L' | 'R' | 'U' | 'D' | 'F' | 'B'
export type SingleMove = BaseMove | `${BaseMove}'`
export type ScrambleMove = SingleMove | `${BaseMove}2`

export interface ModalButton {
  label: string
  action: () => void
  color?: keyof typeof colorClasses
}

export interface ModalContentProps {
  animations: {
    initial: {
      opacity: number
      x?: number
      y?: number
    }
    animate: {
      opacity: number
      x?: number
      y?: number
    }
    exit: {
      opacity: number
      x?: number
      y?: number
    }
  }
  logo?: boolean
  header?: string
  subTitle?: string
  Icon: IconType | null
  subChildren: React.ReactNode | null
  closeButton?: boolean
  confirmButton: ModalButton | null
  cancelButton: ModalButton | null
  confirmClasses: {
    bg: string
    hoverBg: string
    border: string
  }
  cancelClasses: {
    bg?: string
    hoverBg: string
    border: string
  }
  onClose: () => void
}

export interface UpdatePasswordProps {
  id: string
  body: {
    newPassword: string
    currentPassword?: string
    type: string
  }
}
export interface UpdateUserProps {
  id: string
  defaultAddress?: string
  body?: {
    name: string
    phone?: string
    type?: string
  }
}
