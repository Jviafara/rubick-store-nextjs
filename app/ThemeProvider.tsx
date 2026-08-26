'use client'

import { useEffect } from 'react'
import { useAppSelector } from '@/lib/hooks/redux.hooks'

export default function ThemeProvider() {
  const { themeMode } = useAppSelector(state => state.themeMode)

  useEffect(() => {
    const htmlElement = document.documentElement

    if (themeMode === 'dark') {
      htmlElement.classList.add('dark')
    } else {
      htmlElement.classList.remove('dark')
    }
  }, [themeMode])

  return null
}
