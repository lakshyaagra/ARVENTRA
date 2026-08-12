import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice"
import creditHealthReducer from '../features/creditHealth/creditHealthSlice'
import goalReducer from "../features/goals/goalSlice";
import incomeReducer from "../features/income/incomeSlice"
import expenseReducer from "../features/expenses/expenseSlice"
import assetReducer from "../features/assets/assetSlice"

export const store = configureStore({
    reducer: {
        auth: authReducer,
        dashboard: dashboardReducer,
        creditHealth: creditHealthReducer,
        goals: goalReducer,
        income:incomeReducer,
        expense:expenseReducer,
        assets:assetReducer,
    }
});