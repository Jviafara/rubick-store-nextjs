import { ImodalSlice } from '@/lib/types'
import { createSlice } from '@reduxjs/toolkit'

const initialState: ImodalSlice = {
  modalService: false,
}

export const modalSlice = createSlice({
  name: 'modalService',
  initialState,
  reducers: {
    setModalService: (state, action) => {
      state.modalService = action.payload
    },
  },
})

export const { setModalService } = modalSlice.actions
export default modalSlice.reducer
