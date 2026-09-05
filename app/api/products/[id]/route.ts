import { auth } from '@/lib/auth/auth'
import Product from '@/lib/models/product'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user || session.user.role !== 'admin') {
      return responseHandler.unauthorize()
    }
    await connectDB()

    const product = await Product.findById(id)

    if (!product) {
      return responseHandler.notFound()
    }

    const body = await req.json()

    const updatedProduct = await Product.findByIdAndUpdate(id, body)

    return responseHandler.ok(updatedProduct)
  } catch (err) {
    console.error(err)
    return responseHandler.error()
  }
}
