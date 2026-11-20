import { mockAddress, mockAddressList } from '@/__mocks__/Address.mock'
import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { mockUser, mockUserSession } from '@/__mocks__/users.mock'
import { DELETE, GET, PUT } from '@/app/api/address/[id]/route'
import { auth } from '@/lib/auth/auth'
import Address from '@/lib/models/address'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import { NextRequest } from 'next/server'

const mockAuthSession = jest.mocked(auth.api.getSession) as jest.Mock
const mockAuthUpdateUser = jest.mocked(auth.api.updateUser) as jest.Mock
const mockAddressFind = Address.find as unknown as jest.Mock
const mockAddressFindById = Address.findById as unknown as jest.Mock
const mockAddressDelete = Address.findByIdAndDelete as unknown as jest.Mock
const mockAddressUpdate = Address.findByIdAndUpdate as unknown as jest.Mock
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
    findByIdAndUpdate: jest.fn(),
    findByIdAndDelete: jest.fn(),
  },
}))

jest.mock('@/lib/models/user', () => ({
  __esModule: true,
  User: {
    findById: jest.fn(),
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

const getRequest = async (addressId = '') =>
  GET(new NextRequest(`http://localhost:3000/api/address/${addressId}`), {
    params: Promise.resolve({ id: addressId }),
  })
const putRequest = (bodyData: Record<string, unknown>, addressId = '') =>
  PUT(
    new NextRequest(`http://localhost:3000/api/address/${addressId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    }),
    {
      params: Promise.resolve({ id: addressId }),
    },
  )
const deleteRequest = async (addressId = '') =>
  DELETE(new NextRequest(`http://localhost:3000/api/address/${addressId}`), {
    params: Promise.resolve({ id: addressId }),
  })

describe('GET / api/address/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })
    mockAddressFind.mockResolvedValue(mockAddressList)
    mockAddressFindById.mockResolvedValue(mockAddress)
  })

  it('should connect to database', async () => {
    await getRequest('1')

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorize for unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await getRequest('1')

    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return the address found', async () => {
    const res = await getRequest('1')

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok(mockAddress))
  })

  it('should return 404 not found if addres dont exist', async () => {
    mockAddressFindById.mockResolvedValue(null)
    const res = await getRequest('1')

    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should return 500 error api call failed', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockAddressFindById.mockRejectedValue(new Error())
    const res = await getRequest('1')

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})

describe('PUT / api/address/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })
    mockAddressUpdate.mockResolvedValue(mockAddress)
  })

  it('should connect to database', async () => {
    await putRequest(mockAddress, '1')

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorize for unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await putRequest(mockAddress, '1')

    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return the address found', async () => {
    const res = await putRequest(mockAddress, '1')

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok(mockAddress))
  })

  it('should return 500 error api call failed', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockAddressUpdate.mockRejectedValue(new Error())
    const res = await putRequest(mockAddress, '1')

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})

describe('DELETE / api/address/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: { ...mockUser, save: jest.fn() },
      session: mockUserSession,
    })
    mockAddressDelete.mockResolvedValue(mockAddress)
    mockUserFindById.mockResolvedValue(mockUser)
  })

  it('should connect to database', async () => {
    mockUserFindById.mockResolvedValue({ ...mockUser, defaultAddress: '1', save: jest.fn() })
    await deleteRequest('1')

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorize for unauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await deleteRequest('1')

    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return the address found after deleted', async () => {
    const res = await deleteRequest('2')

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok(mockAddress))
  })

  it('should update user if address is set as defaultAddress', async () => {
    mockUserFindById.mockResolvedValue({ ...mockUser, defaultAddress: '1', save: jest.fn() })
    mockAddressFind.mockResolvedValue(mockAddressList)
    const res = await deleteRequest('1')
    expect(mockAuthUpdateUser).toHaveBeenCalledWith({
      headers: expect.any(Headers),
      body: { defaultAddress: mockAddress._id },
    })
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok(mockAddress))
  })

  it('should update user if address is the last user address', async () => {
    mockUserFindById.mockResolvedValue({ ...mockUser, defaultAddress: '1', save: jest.fn() })
    mockAddressFind.mockResolvedValue([])
    const res = await deleteRequest('1')
    expect(mockAuthUpdateUser).toHaveBeenCalledWith({
      headers: expect.any(Headers),
      body: { defaultAddress: null },
    })
    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok(mockAddress))
  })

  it('should return 500 error api call failed', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockAddressDelete.mockRejectedValue(new Error())
    const res = await deleteRequest('1')

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})
