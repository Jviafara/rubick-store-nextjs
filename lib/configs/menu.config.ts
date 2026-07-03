import { AiOutlineHome, AiOutlineShopping, AiOutlineShoppingCart, AiOutlineUser } from 'react-icons/ai'
import { BiCommentCheck } from 'react-icons/bi'
import { BsFillBagFill } from 'react-icons/bs'
import { MdOutlineFavorite } from 'react-icons/md'

const main = [
  {
    display: 'home',
    path: '/',
    icon: AiOutlineHome,
    state: 'home',
  },
  {
    display: 'products',
    path: '/products',
    icon: AiOutlineShopping,
    state: 'products',
  },
  {
    display: 'cart',
    path: '/cart',
    icon: AiOutlineShoppingCart,
    state: 'tv',
  },
]

const user = [
  {
    display: 'User Profile',
    path: '/profile',
    icon: AiOutlineUser,
    state: 'profile',
  },
  {
    display: 'favorites',
    path: '/favorites',
    icon: MdOutlineFavorite,
    state: 'favorites',
  },
  {
    display: 'reviews',
    path: '/reviews',
    icon: BiCommentCheck,
    state: 'reviews',
  },
  {
    display: 'orders',
    path: '/orders',
    icon: BsFillBagFill,
    state: 'orders',
  },
]

const menuConfigs = { main, user }

export default menuConfigs
