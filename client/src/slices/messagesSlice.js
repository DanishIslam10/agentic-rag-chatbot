import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeChatId: null,
  activeSessionId: null,
  messages: [],
};

const messagesSlice = createSlice({
  name: 'messages',
  initialState,
  reducers: {

    setActiveChatId: (state, action) => {
      state.activeChatId = action.payload;
    },

    setActiveSessionId: (state, action) => {
      state.activeSessionId = action.payload;
    },

    addMessages: (state, action) => {
      state.messages.push(...action.payload);
    },

    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },
});

export const { addMessage, addMessages, clearMessages, setActiveChatId, setActiveSessionId } = messagesSlice.actions;

export default messagesSlice.reducer;