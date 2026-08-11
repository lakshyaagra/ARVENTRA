import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Learning from "../pages/Learning";
import CreditHealth from "../pages/CreditHealth"

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
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;