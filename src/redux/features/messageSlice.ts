import { createSlice } from '@reduxjs/toolkit'
import type {PayloadAction} from "@reduxjs/toolkit"

export const messageSlice = createSlice({
  name: 'message',
  initialState: {
    text: '',
    type: ''
  },
  reducers: {
    deleteMessage: (state) => {
        state.text = ''
        state.type = ''
    },
    setMessage: (state, action : PayloadAction<{text: string; type: string}>) => {
        state.text = action.payload.text;
        state.type = action.payload.type;
    },
  },
})

export const { deleteMessage, setMessage } = messageSlice.actions;
export default messageSlice.reducer;
