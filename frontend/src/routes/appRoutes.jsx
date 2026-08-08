import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import Home from "../pages/Home";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/register" element={<Register/>} />
                <Route element={<ProtectedRoute />}> 
                    <Route path="/dashboard" element={<Dashboard />} /> 
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;