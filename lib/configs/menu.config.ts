import { AiOutlineUser } from 'react-icons/ai'
import { BiCommentCheck } from 'react-icons/bi'
import { BsFillBagFill } from 'react-icons/bs'
import { FaProductHunt, FaUsers } from 'react-icons/fa'
import { IoReceiptSharp } from 'react-icons/io5'

import { MdOutlineFavorite } from 'react-icons/md'

const user = [
  {
    display: 'User Profile',
    path: '/profile?tab=user-info',
    tab: 'user-info',
    icon: AiOutlineUser,
    state: 'profile',
  },
  {
    display: 'favorites',
    path: '/profile?tab=favorites',
    tab: 'favorites',
    icon: MdOutlineFavorite,
    state: 'favorites',
  },
  {
    display: 'orders',
    path: '/profile?tab=orders',
    tab: 'orders',
    icon: BsFillBagFill,
    state: 'orders',
  },
  {
    display: 'reviews',
    path: '/profile?tab=reviews',
    tab: 'reviews',
    icon: BiCommentCheck,
    state: 'reviews',
  },
]
const admin = [
  {
    display: 'Orders List',
    icon: IoReceiptSharp,
    state: 'order',
  },
  {
    display: 'Users List',
    icon: FaUsers,
    state: 'users',
  },
  {
    display: 'Products List',
    icon: FaProductHunt,
    state: 'products',
  },
]

const menuConfigs = { user, admin }

export default menuConfigs
