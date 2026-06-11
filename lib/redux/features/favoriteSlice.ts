import { IFavoriteSlice } from '@/lib/types'
import { createSlice } from '@reduxjs/toolkit'

const initialState: IFavoriteSlice = {
  favoriteList: [],
}

export const favoriteSlice = createSlice({
  name: 'favoriteList',
  initialState,
  reducers: {
    setFavoriteList: (state, action) => {
      state.favoriteList = action.payload
    },
    removeFavorite: (state, action) => {
      const { productId } = action.payload
      state.favoriteList = [...state.favoriteList].filter(e => e.product !== productId)
    },
    addFavorite: (state, action) => {
      state.favoriteList = [action.payload, ...state.favoriteList]
    },
  },
})

export const { setFavoriteList, addFavorite, removeFavorite } = favoriteSlice.actions
export default favoriteSlice.reducer
