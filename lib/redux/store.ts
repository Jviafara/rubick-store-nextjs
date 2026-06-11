import { combineReducers, configureStore } from '@reduxjs/toolkit'
import globalLoadingSlice from './features/globalLoadingSlice'
import cartSlice from './features/cartSlice'
import favoriteSlice from './features/favoriteSlice'

const rootReducer = combineReducers({
  globalLoading: globalLoadingSlice,
  cart: cartSlice,
  favoriteList: favoriteSlice,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
