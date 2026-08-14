import Product from '@/lib/models/product'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { getSortRule } from '@/lib/utils'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const query = searchParams.get('query')
  const filter = searchParams.get('filter')
  const priceMin = parseInt(searchParams.get('price_min') || '0')
  const priceMax = Number(searchParams.get('price_max') || 'Inifity')
  const sortBy = searchParams.get('sort_by') || 'Latest'

  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10))
  const pageSize = Math.max(1, parseInt(searchParams.get('page_size') || '12'))
  const skip = (page - 1) * pageSize

  const mongoQuery = {
    name: { $regex: query, $options: 'i' },
    $and: [
      { price: { $gte: priceMin } },
      { price: { $lte: priceMax } },
      { category: filter !== 'All products' ? filter : { $exists: true } },
    ],
  }

  const sortRule = JSON.parse(getSortRule(sortBy))

  try {
    await connectDB()
    if (query) {
      const products = await Product.find(mongoQuery).sort(sortRule).skip(skip).limit(pageSize)
      if (products.length <= 0) return responseHandler.notFound()

      const total: number = await Product.countDocuments(mongoQuery)
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

    const products = await Product.find(mongoQuery).sort(sortRule).skip(skip).limit(pageSize)
    if (!products) return responseHandler.notFound()

    const total: number = await Product.countDocuments(mongoQuery)
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
  } catch (e) {
    console.error(e)
    return responseHandler.badRequest(String(e) || 'Error al buscar los productos')
  }
}
