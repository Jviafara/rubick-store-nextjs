/**
 * @jest-environment node
 */
import responseHandler from '@/lib/responseHandler'

describe('responseHandler', () => {
  it('responseWithData uses the given status and body', async () => {
    const res = responseHandler.responseWithData({ hello: 'world' }, 202)

    expect(res.status).toBe(202)
    await expect(res.json()).resolves.toEqual({ hello: 'world' })
  })

  it('ok returns 200 with the data', async () => {
    const res = responseHandler.ok({ products: [] })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ products: [] })
  })

  it('justOk returns 200 with a status body', async () => {
    const res = responseHandler.justOk()

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual({ status: 200 })
  })

  it('created returns 201 with the data', async () => {
    const res = responseHandler.created({ id: 'abc' })

    expect(res.status).toBe(201)
    await expect(res.json()).resolves.toEqual({ id: 'abc' })
  })

  it('badRequest returns 400 with the message', async () => {
    const res = responseHandler.badRequest('Missing field')

    expect(res.status).toBe(400)
    await expect(res.json()).resolves.toEqual({ status: 400, message: 'Missing field' })
  })

  it('unauthorize returns 401', async () => {
    const res = responseHandler.unauthorize()

    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual({ status: 401, message: 'Unauthorized' })
  })

  it('notFound returns 404', async () => {
    const res = responseHandler.notFound()

    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual({ status: 404, message: 'Resource Not Found' })
  })

  it('error returns 500', async () => {
    const res = responseHandler.error()

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({ status: 500, message: 'Oops! Something wrong!' })
  })
})
