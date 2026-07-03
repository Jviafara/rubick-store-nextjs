import Product from '@/lib/models/product'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'

export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    await connectDB()
    const product = await Product.findOne({ slug })

    if (!product) return responseHandler.notFound()

    return responseHandler.ok(product)
  } catch (error) {
    return responseHandler.badRequest(String(error) || 'Error al buscar los productos')
  }
}
