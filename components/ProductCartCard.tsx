import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { addcartItem, removecartItem } from '@/lib/redux/features/cartSlice'
import { ICartItem } from '@/lib/types'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { FaHeart, FaMinus, FaPlus, FaTrashAlt } from 'react-icons/fa'
import { toast } from 'react-toastify'

interface Props {
  cartItem: ICartItem
}

const ProductCartCard = ({ cartItem }: Props) => {
  const { favoriteList } = useAppSelector(state => state.favoriteList)
  const isFavorito = Boolean(favoriteList.some(item => item.product === cartItem._id))
  const [quantity, setQuantity] = useState(cartItem.quantity)

  const dispatch = useAppDispatch()
  const updateCartHandler = async (item: ICartItem, quantity: number) => {
    dispatch(addcartItem({ ...item, quantity }))
  }

  const removeItem = async (item: ICartItem) => {
    dispatch(removecartItem({ ...item }))
  }

  const increment = () => {
    if (quantity >= cartItem!.countInStock!) {
      toast.error(`Only ${cartItem!.countInStock} in stock!`)
      return
    }
    updateCartHandler(cartItem, quantity + 1)
    setQuantity(prev => prev + 1)
  }

  const decrement = () => {
    if (quantity <= 1) {
      toast.error('Should have at least 1 product!')
      return
    }

    updateCartHandler(cartItem, quantity - 1)
    setQuantity(prev => prev - 1)
  }

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const quantity = parseInt(e.target.value)
    if (quantity < 1) {
      toast.error('Should have at least 1 product!')
      setQuantity(prev => prev)
      return
    }
    if (quantity > cartItem!.countInStock!) {
      toast.error(`Only ${cartItem!.countInStock} in stock!`)
      setQuantity(prev => prev)
      return
    }
    setQuantity(quantity)
  }

  function preventEraseLast(event: React.KeyboardEvent<HTMLInputElement>) {
    const input = event.currentTarget

    if ((event.key === 'Backspace' || event.key === 'Delete') && input.value.length <= 1) {
      event.preventDefault()
    }
  }

  return (
    <div
      className={`relative w-full border border-muted ${!isFavorito ? 'card-base' : 'card-gradient-featured'} rounded-2xl flex flex-col md:flex-row items-center`}
    >
      {/* Image */}
      <Link
        href={`/product/slug/${cartItem.slug}`}
        className='w-full md:w-fit bg-muted/30 rounded-2xl mg:rounded-l-2xl flex justify-center'
      >
        <div className='relative w-40 aspect-square  '>
          <Image
            src={cartItem.images![0]}
            alt={'Image'}
            fill
            sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
            loading='eager'
            className='object-contain z-0 rounded-2xl p-1'
          />
        </div>
      </Link>

      {/* Details section */}
      <section className='w-full h-full px-4 md:px-8  py-6 flex flex-col justify-between gap-4'>
        {/* Name */}
        <div className='w-full flex justify-between items-baseline'>
          <div className='flex flex-col gap-2'>
            <h1 className='text-xl'>{cartItem.name}</h1>
            <p className='bg-muted/20 w-fit px-2 py-0.5 rounded-2xl text-muted text-xs'>{cartItem.category}</p>
          </div>
          <h1 className='text-2xl font-bold  md:hidden'>${cartItem.price}</h1>
          {isFavorito && (
            <div className='hidden md:inline-flex'>
              <FaHeart
                size={24}
                className='text-secondary'
              />
            </div>
          )}
        </div>

        {/* Quantity and price */}
        <div className='w-full flex justify-between items-baseline-last'>
          <h1 className='text-xl font-bold hidden md:inline-flex'>${cartItem.price}</h1>
          <div className='flex items-center justify-center  text-center w-fit'>
            <button
              onClick={decrement}
              className='bg-background h-8 w-8 rounded-l-sm flex justify-center items-center'
            >
              <FaMinus size={16} />
            </button>
            <div className='w-8 md:[20%] max-w-20'>
              <input
                type='number'
                value={quantity}
                onChange={handleQuantityChange}
                onKeyDown={e => preventEraseLast(e)}
                min={1}
                className='w-full h-8 bg-background/70 text-center! focus:outline-0 focus:border focus:border-primary. [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
              />
            </div>

            <button
              onClick={increment}
              className='bg-background h-8 w-8 rounded-r-sm flex items-center justify-center'
            >
              <FaPlus size={16} />
            </button>
          </div>
          <h1 className='text-xl font-bold leading-none'>${(cartItem.price || 0) * quantity}</h1>
          <button
            onClick={() => removeItem(cartItem)}
            className='hover:text-secondary rounded-lg'
          >
            <FaTrashAlt size={20} />
          </button>
        </div>
      </section>

      {/* Favorite heart */}
      {isFavorito && (
        <div className='absolute top-3 right-3 md:hidden'>
          <FaHeart
            size={24}
            className='text-secondary'
          />
        </div>
      )}
    </div>
  )
}

export default ProductCartCard
