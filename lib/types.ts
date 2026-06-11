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
  shippingAddress: any[]
  cartItems: ICartItem[]
}

export interface IFavoriteSlice {
  favoriteList: IFavorite[]
}

export interface ContainerProps {
  header: string
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
