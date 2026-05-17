import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../slices/authSlice";
import messagesReducer from "../slices/messagesSlice";
import previousChatsReducer from "../slices/previousChatsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    messages: messagesReducer,
    previousChats: previousChatsReducer,
  },
});