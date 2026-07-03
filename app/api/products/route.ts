import Product from '@/lib/models/product'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'

export async function GET() {
  try {
    await connectDB()
    const products = await Product.find()
    if (!products) return responseHandler.notFound()

    return responseHandler.ok(products)
  } catch (e) {
    return responseHandler.badRequest(String(e) || 'Error al buscar los productos')
  }
}
