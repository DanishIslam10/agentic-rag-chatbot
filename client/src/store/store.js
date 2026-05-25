import { configureStore } from "@reduxjs/toolkit";
import messagesReducer from "../slices/messagesSlice";
import previousChatsReducer from "../slices/previousChatsSlice";

export const store = configureStore({
  reducer: {
    messages: messagesReducer,
    previousChats: previousChatsReducer,
  },
});