import { auth } from '@/lib/auth/auth'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  console.log('Get Users')
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (session?.user.role !== 'admin') {
      return responseHandler.unauthorize()
    }

    await connectDB()
    const users = await User.find()
    if (!users) return responseHandler.notFound()

    return responseHandler.ok(users)
  } catch (e) {
    return responseHandler.badRequest(String(e) || 'Error al buscar los usuarios')
  }
}
