// app/api/auth/[...all]/route.test.ts
import { auth } from '@/lib/auth/auth'
import { toNextJsHandler } from 'better-auth/next-js'

const mockGet = jest.fn()
const mockPost = jest.fn()

jest.mock('@/lib/auth/auth', () => ({
  auth: { $mockAuthInstance: true },
}))

jest.mock('better-auth/next-js', () => ({
  toNextJsHandler: jest.fn(() => ({
    GET: mockGet,
    POST: mockPost,
  })),
}))

describe('Auth route handler', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('wires GET and POST handlers using the auth instance', async () => {
    // Import route after mocks are registered
    const { GET, POST } = await import('@/app/api/auth/[...all]/route')

    expect(toNextJsHandler).toHaveBeenCalledWith(auth)

    const getReq = new Request('http://localhost:3000/api/auth/get-session')
    mockGet.mockResolvedValueOnce(new Response(JSON.stringify({ session: null }), { status: 200 }))

    const getRes = await GET(getReq)
    expect(mockGet).toHaveBeenCalledWith(getReq)
    expect(getRes.status).toBe(200)

    const postReq = new Request('http://localhost:3000/api/auth/sign-in/email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
    })
    mockPost.mockResolvedValueOnce(new Response(JSON.stringify({ user: { id: '1' } }), { status: 200 }))

    const postRes = await POST(postReq)
    expect(mockPost).toHaveBeenCalledWith(postReq)
    expect(postRes.status).toBe(200)
  })
})
