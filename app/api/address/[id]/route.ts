import { auth } from '@/lib/auth/auth'
import Address from '@/lib/models/address'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })

    if (!session?.user) {
      return responseHandler.unauthorize()
    }

    await connectDB()

    const address = await Address.findById(id)
    if (!address) return responseHandler.notFound()

    return responseHandler.ok(address)
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user) {
      return responseHandler.unauthorize()
    }

    const { id } = await params
    const body = await req.json()

    await connectDB()
    const address = await Address.findByIdAndUpdate(id, body)

    return responseHandler.ok(address)
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user) {
      return responseHandler.unauthorize()
    }

    const { id } = await params

    await connectDB()
    const address = await Address.findByIdAndDelete(id)

    const user = await User.findById(session.user.id)
    if (user.defaultAddress === id) {
      const userAddresses = await Address.find({ user: user._id })
      if (userAddresses.length > 0) {
        user.defaultAddress = userAddresses[0]._id
        await user.save()
        await auth.api.updateUser({
          headers: req.headers,
          body: { defaultAddress: user.defaultAddress },
        })
      } else {
        user.defaultAddress = null
        await user.save()
        await auth.api.updateUser({
          headers: req.headers,
          body: { defaultAddress: null },
        })
      }
    }

    return responseHandler.ok(address)
  } catch (e) {
    console.error(e)
    return responseHandler.error()
  }
}
