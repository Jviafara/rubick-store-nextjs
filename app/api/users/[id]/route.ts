import { changeUserPassword, setUserPassword } from '@/lib/actions/password.actions'
import { auth } from '@/lib/auth/auth'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { NextRequest } from 'next/server'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    // if (!session?.user || session?.user.role !== 'admin') {
    //   return responseHandler.unauthorize()
    // }

    if (!session?.user || session?.user.id !== id) {
      return responseHandler.unauthorize()
    }

    await connectDB()

    const body = await req.json()

    const user = await User.findById(id)

    if (!user) return responseHandler.notFound()

    if (body.type === 'create') {
      const result = await setUserPassword(body.newPassword)
      if (result.success) {
        return responseHandler.ok({ message: 'Password created' })
      }
      return responseHandler.badRequest('Error Creating password')
    } else if (body.type === 'change') {
      const result = await changeUserPassword({ newPassword: body.newPassword, currentPassword: body.currentPassword })
      if (result.success) {
        return responseHandler.ok({ message: 'Password changed' })
      }
      return responseHandler.badRequest(result.error || 'Error changing password')
    }

    user.name = body.name
    user.phone = body.phone

    await auth.api.updateUser({
      headers: req.headers,
      body: { name: user.name, phone: user.phone },
    })

    await user.save()

    return responseHandler.ok(user)
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}
