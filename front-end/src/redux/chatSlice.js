import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currentChat: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    chooseUser: (state, action) => {
      state.currentChat = action.payload;
    },
  },
});

export const { chooseUser } = chatSlice.actions;
export default chatSlice.reducer;
