'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/lib/hooks/redux.hooks'
import { setThemeMode } from '@/lib/redux/features/themeModeSlice'

export default function ThemeProvider() {
  const dispatch = useAppDispatch()
  const { themeMode } = useAppSelector(state => state.themeMode)

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('themeMode')

    if (savedTheme && savedTheme !== themeMode) {
      dispatch(setThemeMode(savedTheme))
    }
  }, [dispatch, themeMode])

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
