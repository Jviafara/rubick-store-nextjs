'use client' // Required for Next.js App Router

import { useState, useEffect } from 'react'

export function useWindowWidth() {
  // Initialize with undefined so server and client renders match
  const [windowWidth, setWindowWidth] = useState<number | undefined>(undefined)

  useEffect(() => {
    // This code only runs on the client side
    function handleResize() {
      setWindowWidth(window.innerWidth)
    }

    // Set initial width immediately on mount
    handleResize()

    window.addEventListener('resize', handleResize)

    // Clean up event listener on unmount
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowWidth
}
