import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
};

console.log("Initial auth state:", initialState);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {

    setUser(state, action) {
      state.user = action.payload;
    },

    setisLoggedIn(state, action) {
      state.isLoggedIn = action.payload;
    },

    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
    },

  },
});

export const {setUser,setisLoggedIn,logout} = authSlice.actions;

export default authSlice.reducer;