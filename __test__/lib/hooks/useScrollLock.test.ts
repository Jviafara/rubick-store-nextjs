import { useScrollLock } from '@/lib/hooks/useScrollLock'
import { renderHook } from '@testing-library/react'

describe('useScrollLock', () => {
  const original = window.getComputedStyle(document.body).overflow

  afterEach(() => {
    document.body.style.overflow = ''
  })

  it('does not touch the body while unlocked', () => {
    renderHook(() => useScrollLock(false))

    expect(document.body.style.overflow).not.toBe('hidden')
  })

  it('hides body overflow while locked and restores it on unmount', () => {
    const { unmount } = renderHook(() => useScrollLock(true))

    expect(document.body.style.overflow).toBe('hidden')

    unmount()

    expect(document.body.style.overflow).toBe(original)
  })

  it('locks and unlocks when the flag changes', () => {
    const { rerender } = renderHook(({ locked }) => useScrollLock(locked), {
      initialProps: { locked: false },
    })

    rerender({ locked: true })
    expect(document.body.style.overflow).toBe('hidden')

    rerender({ locked: false })
    expect(document.body.style.overflow).toBe(original)
  })
})
