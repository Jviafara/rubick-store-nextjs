import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { mockUser } from '@/__mocks__/users.mock'
import { PUT } from '@/app/api/users/[id]/route'
import { changeUserPassword, setUserPassword } from '@/lib/actions/password.actions'
import { auth } from '@/lib/auth/auth'
import { User } from '@/lib/models/user'
import connectDB from '@/lib/mongodb'
import { NextRequest } from 'next/server'

const mockUserFindById = User.findById as jest.Mock
const mockAuthSession = auth.api.getSession as unknown as jest.Mock
const mockAuthUpdateUser = auth.api.updateUser as unknown as jest.Mock
const mockSetPassword = setUserPassword as jest.Mock
const mockChangePassword = changeUserPassword as jest.Mock

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
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

jest.mock('@/lib/actions/password.actions', () => ({
  setUserPassword: jest.fn(),
  changeUserPassword: jest.fn(),
}))

const putRequest = (body: unknown, params = '') =>
  PUT(
    new NextRequest(`http://localhost:3000/api/users/1${params}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    }),
    { params: Promise.resolve({ id: '1' }) },
  )

describe('GET / api/users', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
    })
    mockAuthUpdateUser.mockResolvedValue({
      user: mockUser,
    })
    mockUserFindById.mockResolvedValue({ ...mockUser, save: jest.fn() })
  })

  it('should connect to db', async () => {
    await putRequest({ type: '' }, '?default-address=1')

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorize if user is not authenticated', async () => {
    mockAuthSession.mockResolvedValue(null)
    const res = await putRequest({}, '')

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return 401 unauthorize if user is not trying to access a different one', async () => {
    mockAuthSession.mockResolvedValue({ ...mockUser, id: '2' })
    const res = await putRequest({}, '')

    expect(res.status).toEqual(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return 404 notFound', async () => {
    mockUserFindById.mockResolvedValue(null)
    const res = await putRequest({})

    expect(res.status).toEqual(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should return users with new default address', async () => {
    const res = await putRequest({}, '?default-address=2')

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ ...mockUser, defaultAddress: '2' }))
  })

  it('should return users with new created password', async () => {
    mockSetPassword.mockResolvedValue({ success: true })
    const res = await putRequest({ type: 'create' })

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ message: 'Password created' }))
  })

  it('should return 400 when set new password fails', async () => {
    mockSetPassword.mockResolvedValue({
      success: false,
      error: 'Failed to set password',
    })
    const res = await putRequest({ type: 'create' })

    expect(res.status).toEqual(400)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.badRequest('Error Creating password'))
  })

  it('should return users with updated password', async () => {
    mockChangePassword.mockResolvedValue({ success: true })
    const res = await putRequest({ type: 'change' })

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ message: 'Password changed' }))
  })

  it('should return 400 when changing password fails', async () => {
    mockChangePassword.mockResolvedValue({
      success: false,
      error: 'Failed to set password',
    })
    const res = await putRequest({ type: 'change' })

    expect(res.status).toEqual(400)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.badRequest('Failed to set password'))
  })

  it('should return 400 when changing password fails whit default msg', async () => {
    mockChangePassword.mockResolvedValue({
      success: false,
    })
    const res = await putRequest({ type: 'change' })

    expect(res.status).toEqual(400)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.badRequest('Error changing password'))
  })

  it('should return users with updated name and phone', async () => {
    mockChangePassword.mockResolvedValue({ success: true })
    const res = await putRequest({ name: 'Jose', phone: 123454 })

    expect(res.status).toEqual(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ ...mockUser, name: 'Jose', phone: 123454 }))
  })

  it('should return 500 badRequest when api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockUserFindById.mockRejectedValue(new Error())
    const res = await putRequest({})

    expect(res.status).toEqual(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockReset()
  })
})
