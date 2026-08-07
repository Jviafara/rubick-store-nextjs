import { auth } from '@/lib/auth/auth'
import Favorite from '@/lib/models/favorite'
import Product from '@/lib/models/product'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)

  const page = Math.max(1, parseInt(searchParams.get('page') || '', 10))
  const pageSize = Math.max(1, parseInt(searchParams.get('page_size') || ''))
  const skip = (page - 1) * pageSize

  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user) {
      return responseHandler.unauthorize()
    }

    await connectDB()

    if (page) {
      const favoritesList = await Favorite.find({
        user: session?.user.id,
      })

      const productIds = favoritesList.map(favorite => favorite.product)

      const products = await Product.find({
        _id: { $in: productIds },
      })
        .sort('-createdAt')
        .skip(skip)
        .limit(pageSize)

      if (productIds.length <= 0) return responseHandler.notFound()

      const total: number = await Favorite.countDocuments({
        user: session?.user.id,
      })
      const totalPages = Math.ceil(total / pageSize)

      const pagination = {
        currentPage: page,
        pageSize,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      }

      return responseHandler.ok({ products, pagination })
    }

    const favorites = await Favorite.find({
      user: session?.user.id,
    }).sort('-createdAt')
    return responseHandler.ok(favorites)
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user) {
      return responseHandler.unauthorize()
    }
    await connectDB()
    const { productId } = await req.json()
    const isFavorite = await Favorite.findOne({
      user: session.user.id,
      product: productId,
    })
    if (isFavorite) return responseHandler.ok(isFavorite)

    const favorite = new Favorite({
      user: session.user.id,
      product: productId,
    })

    await favorite.save()

    return responseHandler.created(favorite)
  } catch (err) {
    console.error(err)
    return responseHandler.error()
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user) {
      return responseHandler.unauthorize()
    }
    const { favoriteId } = await req.json()

    await connectDB()

    const isFavorite = await Favorite.findOne({
      _id: favoriteId,
    })
    if (!isFavorite) return responseHandler.notFound()

    await Favorite.findByIdAndDelete(favoriteId)

    return responseHandler.ok({ _id: isFavorite._id })
  } catch (err) {
    console.error(err)
    return responseHandler.error()
  }
}
