import { createSlice } from "@reduxjs/toolkit";

// localStorage only exists in the browser, not during server rendering
const initialState = {
  token: typeof window !== "undefined" ? localStorage.getItem("token") : null,
  // true after we logged the admin out because the token stopped working,
  // so the login page can say why they're back there
  sessionExpired: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.token = action.payload;
      state.sessionExpired = false;
      localStorage.setItem("token", action.payload);
    },

    // dispatch(logout())                  -> the admin clicked "Log out"
    // dispatch(logout({ expired: true }))  -> the token expired or was rejected
    logout: (state, action) => {
      state.token = null;
      state.sessionExpired = Boolean(action?.payload?.expired);
      localStorage.removeItem("token");
    },

    // the login page has shown the "session expired" message
    clearSessionExpired: (state) => {
      state.sessionExpired = false;
    },
  },
});

export const { setCredentials, logout, clearSessionExpired } = authSlice.actions;
export default authSlice.reducer;
