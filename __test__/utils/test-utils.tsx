import cartReducer from '@/lib/redux/features/cartSlice'
import favoriteReducer from '@/lib/redux/features/favoriteSlice'
import globalLoadingReducer from '@/lib/redux/features/globalLoadingSlice'
import modalReducer from '@/lib/redux/features/modalSlice'
import themeModeReducer from '@/lib/redux/features/themeModeSlice'
import type { RootState } from '@/lib/redux/store'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { render, type RenderOptions } from '@testing-library/react'
import type { ReactElement, ReactNode } from 'react'
import { Provider } from 'react-redux'

// Same shape as the app store, but created fresh for every test so state never leaks between tests.
const rootReducer = combineReducers({
  themeMode: themeModeReducer,
  globalLoading: globalLoadingReducer,
  cart: cartReducer,
  favoriteList: favoriteReducer,
  modalService: modalReducer,
})

export const makeStore = (preloadedState?: Partial<RootState>) =>
  configureStore({
    reducer: rootReducer,
    preloadedState: preloadedState as Partial<ReturnType<typeof rootReducer>> | undefined,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
  })

export type TestStore = ReturnType<typeof makeStore>

type RenderWithProvidersOptions = Omit<RenderOptions, 'wrapper'> & {
  preloadedState?: Partial<RootState>
  store?: TestStore
}

export const renderWithProviders = (
  ui: ReactElement,
  { preloadedState, store = makeStore(preloadedState), ...renderOptions }: RenderWithProvidersOptions = {},
) => {
  const Wrapper = ({ children }: { children: ReactNode }) => <Provider store={store}>{children}</Provider>

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) }
}
