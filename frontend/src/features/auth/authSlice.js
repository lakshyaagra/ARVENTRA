import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: null,
    isAuthenticated: false,
    loading: false,

    // True until the app's initial silent-refresh attempt (AuthInitializer)
    // completes. Routes that gate on isAuthenticated should wait for this
    // to go false first, or a real logged-in user gets bounced to /login
    // on every hard refresh before the silent refresh has had a chance to run.
    initializing: true
};

const authSlice = createSlice({
    name: "auth",

    initialState,

    reducers: {

        loginStart(state){
            state.loading = true;
        },

        loginSuccess(state, action){
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },

        loginFailure(state){
            state.loading = false;
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
        },

        logout(state){
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.loading=false;
            state.initializing = false;
        }
    }
});

export const {loginStart,loginSuccess,loginFailure,logout} = authSlice.actions;

export default authSlice.reducer;