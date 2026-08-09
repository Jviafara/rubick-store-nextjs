import responseHandler from '@/lib/responseHandler'
import { NextRequest, NextResponse } from 'next/server'
import { Scrambow } from 'scrambow'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const type = searchParams.get('type') // e.g., ?query=hello
    if (!type) {
      const scrambler = new Scrambow().get()
      return responseHandler.ok(scrambler[0].scramble_string)
    }

    const scrambler = new Scrambow().setType(type).get()
    return responseHandler.ok(scrambler[0].scramble_string)
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to generate scramble' }, { status: 500 })
  }
}
