import globalLoadingReducer, { setGlobalLoading } from '@/lib/redux/features/globalLoadingSlice'
import themeModeReducer, { setThemeMode } from '@/lib/redux/features/themeModeSlice'

describe('themeModeSlice', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('defaults to dark mode', () => {
    expect(themeModeReducer(undefined, { type: 'unknown' })).toEqual({ themeMode: 'dark' })
  })

  it('setThemeMode updates the state and persists the choice', () => {
    const state = themeModeReducer({ themeMode: 'dark' }, setThemeMode('light'))

    expect(state.themeMode).toBe('light')
    expect(localStorage.getItem('themeMode')).toBe('light')
  })
})

describe('globalLoadingSlice', () => {
  it('is not loading by default', () => {
    expect(globalLoadingReducer(undefined, { type: 'unknown' })).toEqual({ globalLoading: false })
  })

  it('setGlobalLoading toggles the flag', () => {
    const loading = globalLoadingReducer({ globalLoading: false }, setGlobalLoading(true))
    expect(loading.globalLoading).toBe(true)

    const idle = globalLoadingReducer(loading, setGlobalLoading(false))
    expect(idle.globalLoading).toBe(false)
  })
})
