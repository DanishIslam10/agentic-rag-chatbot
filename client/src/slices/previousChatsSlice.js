import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    previousChats: [],
};

const previousChatsSlice = createSlice({
    name: 'previousChats',
    initialState,
    reducers: {
            addPreviousChats: (state, action) => {
            state.previousChats = action.payload;
        },
        addPreviousChat: (state, action) => {
            state.previousChats.unshift(action.payload);
        },
        removePreviousChat: (state, action) => {
            state.previousChats = state.previousChats.filter(
                (chat) => chat._id !== action.payload
            );
        },
        clearPreviousChats: (state) => {
            state.previousChats = [];
        },
    },
}); 

export const { addPreviousChats, clearPreviousChats, addPreviousChat, removePreviousChat } = previousChatsSlice.actions;
export default previousChatsSlice.reducer;
