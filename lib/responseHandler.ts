import { NextResponse } from 'next/server'
const responseWithData = (body: unknown, status: number) => NextResponse.json(body, { status })

const error = () =>
  responseWithData(
    {
      status: 500,
      message: 'Oops! Something wrong!',
    },
    500,
  )

const badRequest = (message: string) => responseWithData({ status: 400, message }, 400)

const ok = (data: unknown) => responseWithData(data, 200)

const justOk = () => NextResponse.json({ status: 200 })

const created = (data: unknown) => responseWithData(data, 201)

const unauthorize = () => responseWithData({ status: 401, message: 'Unauthorized' }, 401)

const notFound = () => responseWithData({ status: 404, message: 'Resource Not Found' }, 404)

const responseHandler = {
  responseWithData,
  error,
  badRequest,
  ok,
  justOk,
  created,
  unauthorize,
  notFound,
}

export default responseHandler
