import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice"
import creditHealthReducer from '../features/creditHealth/creditHealthSlice'
import goalReducer from "../features/goals/goalSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        creditHealth: creditHealthReducer,
        goals: goalReducer,
    }
});