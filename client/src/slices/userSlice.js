import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        loading: false,
        isAuthenticated: false,
        user: null,
        error: null,
        isLogin: false,
        success: false,
    },

    reducers: {
        loginRequest: (state) => {
            state.loading = true;
            state.isAuthenticated = false;
        },

        loginSuccess: (state, action) => {
            state.loading = false;
            state.isAuthenticated = true;
            state.user = action.payload;
            state.isLogin = true;
        },

        loginFail: (state, action) => {
            state.loading = false;
            state.isAuthenticated = false;
            state.user = null;
            state.error = action.payload;
            state.wrongCredentialsErr = true;
        },

        setIsLoginTrue: (state) => {
            state.isLogin = true
        },

        setIsLoginFalse: (state) => {
            state.isLogin = false
        },
    }, 
});

export const { loginRequest, loginSuccess, loginFail, setIsLoginFalse, setIsLoginTrue, } = userSlice.actions;

export default userSlice.reducer;
