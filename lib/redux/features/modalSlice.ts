import { ModalPositions } from '@/lib/constants'
import { ImodalSlice } from '@/lib/types'
import { createSlice } from '@reduxjs/toolkit'
import { IoWarningOutline } from 'react-icons/io5'

const initialState: ImodalSlice = {
  config: {
    modalOpen: false,
    header: '',
    subTitle: '',
    type: '',
    position: ModalPositions.Center,
    children: '',
    icon: IoWarningOutline,
    logo: false,
    closeButton: true,
    confirmButton: null,
    cancelButton: null,
  },
}

export const modalSlice = createSlice({
  name: 'modalService',
  initialState,
  reducers: {
    toogleModalService: (state, action) => {
      state.config.modalOpen = action.payload
      state.config = initialState.config
    },
    setModalService: (state, action) => {
      state.config = { ...state.config, ...action.payload }
    },
  },
})

export const { toogleModalService, setModalService } = modalSlice.actions
export default modalSlice.reducer
