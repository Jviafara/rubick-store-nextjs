import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { mockUser } from '@/__mocks__/users.mock'
import { GET } from '@/app/api/users/route'
import { auth } from '@/lib/auth/auth'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import { NextRequest } from 'next/server'

const mockUserFind = User.find as jest.Mock
const mockAuthSession = auth.api.getSession as unknown as jest.Mock

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/lib/models/user', () => ({
  __esModule: true,
  User: {
    find: jest.fn(),
  },
}))

jest.mock('@/lib/auth/auth', () => ({
  auth: {
    api: {
      getSession: jest.fn(),
    },
  },
}))

const getRequest = () => GET(new NextRequest('http://localhost:3000/api/users'))

describe('GET / api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: { ...mockUser, role: 'admin' },
    })
    mockUserFind.mockResolvedValue([{ ...mockUser }])
  })

  it('should connect to db', async () => {
    await getRequest()

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorize if user is not admin', async () => {
    mockAuthSession.mockResolvedValue({
      user: mockUser,
    })
    const res = await getRequest()

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return users', async () => {
    const res = await getRequest()

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok([{ ...mockUser }]))
  })

  it('should return 404 notFound', async () => {
    mockUserFind.mockResolvedValue(null)
    const res = await getRequest()

    expect(res.status).toEqual(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should return 400 badRequest', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockUserFind.mockRejectedValue(new Error())
    const res = await getRequest()

    expect(res.status).toEqual(400)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.badRequest('Error'))

    consoleError.mockReset()
  })

  it('should return 400 badRequest whit default msg', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockUserFind.mockRejectedValue(null)
    const res = await getRequest()

    expect(res.status).toEqual(400)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.badRequest('Error al buscar los usuarios'))

    consoleError.mockReset()
  })
})
