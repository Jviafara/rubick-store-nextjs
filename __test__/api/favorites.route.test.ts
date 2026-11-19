import { mockResponseHandler } from '@/__mocks__/responseHandler.mock'
import { mockUser, mockUserSession } from '@/__mocks__/users.mock'
import { DELETE, GET, POST } from '@/app/api/favorites/route'
import { auth } from '@/lib/auth/auth'
import Favorite from '@/lib/models/favorite'
import Product from '@/lib/models/product'
import connectDB from '@/lib/mongodb'
import { NextRequest } from 'next/server'

const mockAuthSession = jest.mocked(auth.api.getSession) as jest.Mock
const mockFavoritesFind = Favorite.find as unknown as jest.Mock
const mockFavoritesFindOne = Favorite.findOne as jest.Mock
const mockFavoritesDelete = Favorite.findByIdAndDelete as jest.Mock
const mockProductFind = Product.find as jest.Mock
const mockSave = jest.fn()
const mockFavorites = [
  {
    _id: 'fav-2',
    user: '1',
    product: 'product-123',
    createdAt: '2026-11-19T12:00:00Z',
  },
  {
    _id: 'fav-1',
    user: '1',
    product: 'product-456',
    createdAt: '2026-11-18T12:00:00Z',
  },
]

jest.mock('@/lib/mongodb', () => ({
  __esModule: true,
  default: jest.fn(),
}))

jest.mock('@/lib/models/favorite', () => {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const FavoriteConstructor: any = jest.fn().mockImplementation(data => ({
    ...data,
    save: mockSave,
  }))
  FavoriteConstructor.find = jest.fn()
  FavoriteConstructor.findOne = jest.fn()
  FavoriteConstructor.findByIdAndDelete = jest.fn()
  FavoriteConstructor.countDocuments = jest.fn()

  return {
    __esModule: true,
    default: FavoriteConstructor,
  }
})

jest.mock('@/lib/models/product', () => ({
  __esModule: true,
  default: {
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

const getRequest = (queryString = '') => GET(new NextRequest(`http://localhost:3000/api/favorites${queryString}`))
const deleteRequest = (bodyData: Record<string, unknown>) =>
  DELETE(
    new NextRequest(`http://localhost:3000/api/address`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bodyData),
    }),
  )
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

describe('GET / api/favorites', () => {
  const mockLimit = jest.fn()
  const mockSkip = jest.fn()
  const mockSort = jest.fn()
  const mockFSort = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })
    mockFavoritesFind.mockReturnValue({ sort: mockFSort })
    mockFSort.mockResolvedValue(mockFavorites)

    mockLimit.mockResolvedValue([])
    mockSkip.mockReturnValue({ limit: mockLimit })
    mockSort.mockReturnValue({ skip: mockSkip })
    mockProductFind.mockReturnValue({ sort: mockSort })
  })

  it('connect to db', async () => {
    await getRequest()

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorized to anauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await getRequest()

    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return favorite list when no params are passed', async () => {
    const res = await getRequest()

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok(mockFavorites))
  })

  it('should return product list and pagination when page > 0', async () => {
    mockFavoritesFind.mockResolvedValue(mockFavorites)
    const paginatedProducts = [
      { _id: 'prod-2', name: 'Item 2' },
      { _id: 'prod-1', name: 'Item 1' },
    ]
    mockLimit.mockResolvedValue(paginatedProducts)
    ;(Favorite.countDocuments as jest.Mock).mockResolvedValue(5)

    const res = await getRequest('?page=1&page_size=10')
    const body = await res.json()

    expect(res.status).toBe(200)
    expect(body.products).toEqual(paginatedProducts)
    expect(body.pagination).toEqual({
      currentPage: 1,
      pageSize: 10,
      total: 5,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    })
  })

  it('should return 404 notFound products dont exist', async () => {
    mockFavoritesFind.mockResolvedValue([{ ...mockFavorites[0], product: null }])

    const res = await getRequest('?page=1&page_size=10')

    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should return 500 error when api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    mockFSort.mockRejectedValue(new Error('Error'))

    const res = await getRequest()

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})

describe('POST / api/favorites', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })
    mockFavoritesFindOne.mockResolvedValue(mockFavorites[0])
    mockSave.mockReset()
  })

  it('connect to db', async () => {
    await postRequest({ productId: 'product_123' })

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorized to anauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await postRequest({ productId: 'product_123' })

    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return favorite when product is already set as favorite', async () => {
    const res = await postRequest({ productId: 'product_123' })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ ...mockFavorites[0] }))
  })

  it('should create favorite when product is not set as favorite', async () => {
    mockFavoritesFindOne.mockResolvedValue(null)
    mockSave.mockResolvedValue({ ...mockFavorites[0] })

    const res = await postRequest({ productId: 'product_123' })

    expect(res.status).toBe(201)
    await expect(res.json()).resolves.toEqual(
      mockResponseHandler.created({ user: mockUser.id, product: 'product_123' }),
    )
  })

  it('should return 500 error when api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})
    mockFavoritesFindOne.mockResolvedValue(null)
    mockSave.mockRejectedValue(new Error('Error'))

    const res = await postRequest({ productId: 'product_123' })

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})

describe('DELETE / api/favorites', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockAuthSession.mockResolvedValue({
      user: mockUser,
      session: mockUserSession,
    })
    mockFavoritesFindOne.mockResolvedValue(mockFavorites[0])
    mockFavoritesDelete.mockResolvedValue(mockFavorites[0])
  })

  it('connect to db', async () => {
    await deleteRequest({ favoriteId: 'fav-1' })

    expect(connectDB).toHaveBeenCalledTimes(1)
  })

  it('should return 401 unauthorized to anauthenticated users', async () => {
    mockAuthSession.mockResolvedValue({
      user: null,
      session: null,
    })
    const res = await deleteRequest({ favoriteId: 'fav-1' })

    expect(res.status).toBe(401)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.unauthorize())
  })

  it('should return deleted favorite id', async () => {
    const res = await deleteRequest({ favoriteId: 'fav-1' })

    expect(res.status).toBe(200)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.ok({ _id: mockFavorites[0]._id }))
  })

  it('should return 404 notFound if favorite doesnt exists', async () => {
    mockFavoritesFindOne.mockResolvedValue(null)
    const res = await deleteRequest({ favoriteId: 'fav-1' })

    expect(res.status).toBe(404)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.notFound())
  })

  it('should return 500 error when api call fails', async () => {
    const consoleError = jest.spyOn(console, 'error').mockImplementation(() => {})

    mockFavoritesDelete.mockRejectedValue(new Error('Error'))

    const res = await deleteRequest({ favoriteId: 'fav-1' })

    expect(res.status).toBe(500)
    await expect(res.json()).resolves.toEqual(mockResponseHandler.error())

    consoleError.mockRestore()
  })
})
