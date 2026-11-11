import { useWindowHeight } from '@/lib/hooks/useWindowHeight'
import { useWindowWidth } from '@/lib/hooks/useWindowWidth'
import { act, renderHook } from '@testing-library/react'

const originalWidth = window.innerWidth
const originalHeight = window.innerHeight

// `innerWidth` / `innerHeight` are readonly in the DOM typings, so they are redefined instead of assigned.
const setWindowSize = (width: number, height: number) => {
  Object.defineProperty(window, 'innerWidth', { configurable: true, writable: true, value: width })
  Object.defineProperty(window, 'innerHeight', { configurable: true, writable: true, value: height })
}

const resizeWindow = (width: number, height: number) => {
  act(() => {
    setWindowSize(width, height)
    window.dispatchEvent(new Event('resize'))
  })
}

afterEach(() => {
  setWindowSize(originalWidth, originalHeight)
  jest.restoreAllMocks()
})

describe('useWindowWidth', () => {
  it('starts with the current window width', () => {
    const { result } = renderHook(() => useWindowWidth())

    expect(result.current).toBe(window.innerWidth)
  })

  it('updates when the window is resized', () => {
    const { result } = renderHook(() => useWindowWidth())

    resizeWindow(500, 800)

    expect(result.current).toBe(500)
  })

  it('stops listening after unmount', () => {
    const removeEventListener = jest.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useWindowWidth())

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})

describe('useWindowHeight', () => {
  it('reads the window height after mount', () => {
    const { result } = renderHook(() => useWindowHeight())

    expect(result.current).toBe(window.innerHeight)
  })

  it('updates when the window is resized', () => {
    const { result } = renderHook(() => useWindowHeight())

    resizeWindow(1024, 400)

    expect(result.current).toBe(400)
  })

  it('stops listening after unmount', () => {
    const removeEventListener = jest.spyOn(window, 'removeEventListener')
    const { unmount } = renderHook(() => useWindowHeight())

    unmount()

    expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function))
  })
})
