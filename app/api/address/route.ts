import { auth } from '@/lib/auth/auth'
import Address from '@/lib/models/address'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user) {
      return responseHandler.unauthorize()
    }

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type')

    await connectDB()
    if (type === 'default') {
      if (!session.user.defaultAddress) return responseHandler.notFound()
      const address = await Address.findById(session.user.defaultAddress)
      if (!address) return responseHandler.notFound()
      return responseHandler.ok(address)
    }

    const address = await Address.find({ user: session.user.id })
    if (!address) return responseHandler.notFound()

    return responseHandler.ok(address)
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

    const body = await req.json()

    await connectDB()
    const address = await Address.create({ ...body, user: session.user.id })
    const user = await User.findById(session.user.id)
    const defaultAddress = await Address.findById(user.defaultAddress)

    if (!user.defaultAddress || !defaultAddress || body.isDefault) {
      user.defaultAddress = address._id
      await user.save()

      await auth.api.updateUser({
        headers: req.headers,
        body: { defaultAddress: user.defaultAddress },
      })
    }

    return responseHandler.created(address)
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}
