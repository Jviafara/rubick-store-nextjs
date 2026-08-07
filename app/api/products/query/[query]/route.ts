import Product from '@/lib/models/product'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ query: string }> }) {
  const body = await params
  console.log(body)
  try {
    await connectDB()
    const products = await Product.find({ name: { $regex: body.query, $options: 'i' } })

    if (products.length <= 0) return responseHandler.notFound()

    return responseHandler.ok(products)
  } catch (error) {
    console.error(error)
    return responseHandler.error()
  }
}
