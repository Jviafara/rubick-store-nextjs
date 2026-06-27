// hooks/useScrollLock.ts
import { useEffect } from 'react'

export const useScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    if (!isLocked) return

    // Save original body overflow style
    const originalStyle = window.getComputedStyle(document.body).overflow

    // Prevent scrolling
    document.body.style.overflow = 'hidden'

    // Clean up style when component unmounts or status changes
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [isLocked])
}
