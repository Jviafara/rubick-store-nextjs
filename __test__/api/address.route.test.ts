import { mockAddress, mockNewAddress } from '@/__mocks__/Address.mock'
import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { mockUser, mockUserSession } from '@/__mocks__/users.mock'
import { GET, POST } from '@/app/api/address/route'
import { auth } from '@/lib/auth/auth'
import Address from '@/lib/models/address'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import { NextRequest } from 'next/server'

const mockAuthSession = jest.mocked(auth.api.getSession) as jest.Mock
const mockAuthUpdateUser = jest.mocked(auth.api.updateUser) as jest.Mock
const mockAddressFind = Address.find as unknown as jest.Mock
const mockAddressFindById = Address.findById as unknown as jest.Mock
const mockAddressCreate = Address.create as unknown as jest.Mock

const mockUserFindById = User.findById as jest.Mock

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/lib/models/address', () => ({
  __esModule: true,
  default: {
    find: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
  },
}))

jest.mock('@/lib/auth/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
      updateUser: jest.fn(),
    },
  },
}))

jest.mock('@/lib/models/user', () => ({
  __esModule: true,
  User: { findById: jest.fn() },
}))

const getRequest = (queryString = '') => GET(new NextRequest(`http://localhost:3000/api/address${queryString}`))
const postRequest = (bodyData: Record<string, unknown>, queryString = '') =>
  POST(
    new NextRequest(`http://localhost:3000/api/address${queryString}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    }),
  )

describe('GET / api/address', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })
    mockAddressFind.mockResolvedValue([
      { id: '111', address: 'alamos' },
      { id: '222', address: 'alamos2' },
    ])
    mockAddressFindById.mockResolvedValue({ id: '111', address: 'alamos' })
  })

  it('should connect to database', async () => {
    await getRequest('?type=default')

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return unauthorize for unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await getRequest()

    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return addres list', async () => {
    const res = await getRequest()
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(
      mockResponseHandler.ok([
        { id: '111', address: 'alamos' },
        { id: '222', address: 'alamos2' },
      ]),
    )
  })

  it('should return default addres when type = default', async () => {
    const res = await getRequest(`?type=default`)
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ id: '111', address: 'alamos' }))
  })

  it('should return not found when type = "default" and default addres is not found', async () => {
    mockAddressFindById.mockResolvedValue(null)

    const res = await getRequest(`?type=${'default'}`)

    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should return not found when type = "default" and user has no default address set', async () => {
    mockAuthSession.mockResolvedValue({
      user: { ...mockUser, defaultAddress: null },
      session: mockUserSession,
    })

    const res = await getRequest(`?type=${'default'}`)

    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('returns 500 api call failed', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockAddressFind.mockRejectedValue(new Error('Error'))
    const res = await getRequest()

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })

  it('returns 404 when no address not found match', async () => {
    mockAddressFind.mockResolvedValue(null)
    mockAuthSession.mockResolvedValue({
      user: { ...mockUser, defaultAddress: 'zzz' },
      session: mockUserSession,
    })
    const res = await getRequest()

    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })
})

describe('POST / api/address', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })
    mockAddressCreate.mockResolvedValue(mockAddress)
    mockUserFindById.mockResolvedValue(mockUser)
    mockAddressFindById.mockResolvedValue(mockAddress)
  })

  it('should connect to database', async () => {
    await postRequest(mockNewAddress)

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return unauthorize for unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await postRequest({ ...mockNewAddress })

    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should update user when dont have default address', async () => {
    mockUserFindById.mockResolvedValue({ ...mockUser, defaultAddress: null })
    mockAddressFindById.mockResolvedValue(null)
    const res = await postRequest(mockNewAddress)

    expect(mockAuthUpdateUser).toHaveBeenCalledWith({
      headers: expect.any(Headers),
      body: { defaultAddress: mockAddress._id },
    })
    expect(res.status).toBe(201)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.created(mockAddress))
  })

  it('should return created address', async () => {
    const res = await postRequest({ ...mockNewAddress })

    expect(res.status).toBe(201)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.created(mockAddress))
  })

  it('should 500 when failed to create address', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockAddressCreate.mockRejectedValue(new Error('Error'))

    const res = await postRequest(mockNewAddress)

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})
