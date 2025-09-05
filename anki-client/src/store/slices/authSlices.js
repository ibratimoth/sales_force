import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isLoggedIn: false,
  roleId: null,
  permissions: [], 
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.user = action.payload.user;
      state.roleId = action.payload.roleId;
      state.permissions = action.payload.permissions || [];
      state.isLoggedIn = true;
    },
    updateSuccess: (state, action) => {
      state.user = action.payload.user;
      state.roleId = action.payload.roleId;
      state.permissions = action.payload.permissions || [];
      state.isLoggedIn = true;
    },
    setPermissions: (state, action) => {
      state.permissions = action.payload; 
    },
    logout: (state) => {
      state.user = null;
      state.roleId = null;
      state.permissions = [];
      state.isLoggedIn = false;
    },
  },
});

export const { loginSuccess, setPermissions, logout, updateSuccess } = authSlice.actions;
export default authSlice.reducer;
