/**
 * @jest-environment node
 */
import { GET } from '@/app/api/scramble/route'
import { NextRequest } from 'next/server'
import { Scrambow } from 'scrambow'

jest.mock('scrambow', () => ({
  Scrambow: jest.fn(),
}))

const SCRAMBLE = "R U R' U' F2 D L"

const instance = { get: jest.fn(), setType: jest.fn() }

const request = (queryString = '') => GET(new NextRequest(`http://localhost:3000/api/scramble${queryString}`))

describe('GET /api/scramble', () => {
  beforeEach(() => {
    instance.get.mockReturnValue([{ scramble_string: SCRAMBLE }])
    instance.setType.mockReturnValue(instance)
    jest.mocked(Scrambow).mockImplementation(() => instance as never)
  })

  it('returns a default scramble when no type is given', async () => {
    const res = await request()

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toBe(SCRAMBLE)
    expect(instance.setType).not.toHaveBeenCalled()
  })

  it('returns a scramble for the requested puzzle type', async () => {
    const res = await request('?type=222')

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toBe(SCRAMBLE)
    expect(instance.setType).toHaveBeenCalledWith('222')
  })

  it('returns 500 when scramble generation fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    instance.get.mockImplementation(() => {
      throw new Error('boom')
    })

    const res = await request()

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual({ success: false, error: 'Failed to generate scramble' })

    consoleError.mockRestore()
  })
})
