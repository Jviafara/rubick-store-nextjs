import { auth } from '@/lib/auth/auth'
import Solves from '@/lib/models/solves'
import connectDB from '@/lib/mongodb'
import responseHandler from '@/lib/responseHandler'
import { ISolve } from '@/lib/types'
import { calcSolvesAverages } from '@/lib/utils'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user) {
      return responseHandler.unauthorize()
    }
    await connectDB()

    // Get solves
    const solves = await Solves.findOne({ user: session.user.id })

    if (!solves && session.user) {
      const solves = await Solves.create({
        user: session.user.id,
        solvesHistory: [],
      })

      return responseHandler.created(solves)
    }

    return responseHandler.ok(solves)
  } catch (error) {
    console.error(error)
    return responseHandler.error()
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    })
    if (!session?.user) {
      return responseHandler.unauthorize()
    }
    const body = await req.json()

    await connectDB()

    // Get solves
    const solves = await Solves.findOne({ user: session.user.id })
    solves.solvesHistory.unshift({ ...body })

    const averages = calcSolvesAverages(solves.solvesHistory)
    solves.solvesHistory.shift()
    solves.solvesHistory.unshift({ ...body, ...averages })

    await solves.save()

    return responseHandler.ok(solves)
  } catch (error) {
    console.error(error)
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
    const { type, id } = await req.json()

    await connectDB()

    // Get solves
    const solves = await Solves.findOne({ user: session.user.id })
    if (type === 'clear') {
      solves.solvesHistory = []
    } else if (!type) {
      solves.solvesHistory = solves.solvesHistory.filter((solve: ISolve) => solve._id.toString() !== id)
    }

    calcSolvesAverages(solves.solvesHistory)

    await solves.save()

    return responseHandler.ok(solves)
  } catch (error) {
    console.error(error)
    return responseHandler.error()
  }
}
