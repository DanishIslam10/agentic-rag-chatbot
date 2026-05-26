import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  activeChatId: null,
  activeSessionId: null,
  messages: [],
  streamingMessageId: null,
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

    updateMessage: (state, action) => {

      const { _id, content } = action.payload;

      const message = state.messages.find(
        (msg) => msg?._id === _id
      );

      if (message) {
        message.content = content;
      }
    },

    replaceMessage: (state, action) => {

      const { _id, newMessage } = action.payload;
      const index = state.messages.findIndex(
        (msg) => msg?._id === _id
      );
      if (index !== -1) {
        state.messages[index] = newMessage;
      }
    },

    clearMessages: (state) => {
      state.messages = [];
    },

    setStreamingMessageId: (state, action) => {
      state.streamingMessageId = action.payload;
    } 
  },
});

export const { addMessage, addMessages, clearMessages, setActiveChatId, setActiveSessionId, updateMessage, replaceMessage, setStreamingMessageId } = messagesSlice.actions;

export default messagesSlice.reducer;