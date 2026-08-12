import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Learning from "../pages/Learning";
import CreditHealth from "../pages/CreditHealth"
import Goals from '../pages/Goal'
import Income from "../pages/Income";
import Expense from "../pages/Expense"
import Assets from "../pages/Assets";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route path="/learning" element={<Learning/>}/>
                <Route element={<ProtectedRoute />}> 
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} /> 
                        <Route path="/credit-health" element={<CreditHealth />} />
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/income" element={<Income />} />
                        <Route path="/expenses" element={<Expense />} />
                        <Route path="/assets" element={<Assets />} />
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;