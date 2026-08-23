import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/auth/ProtectedRoute";
import PublicOnlyRoute from "../components/auth/PublicOnlyRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../pages/Home";
import Learning from "../pages/Learning";
import CreditHealth from "../pages/CreditHealth"
import Goals from '../pages/Goal'
import Income from "../pages/Income";
import Expense from "../pages/Expense"
import Assets from "../pages/Assets";
import Loan from "../pages/Loan"
import Reports from "../pages/Reports"
import ArventraAI from "../pages/ArventraAI"
import Calculators from "../pages/Calculators";
import AILayout from "../layouts/AILayout";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import Contact from "../pages/Contact";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
import VerifyEmail from "../pages/VerifyEmail";
import NotFound from "../pages/NotFound";

const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Home />} />

                <Route element={<PublicOnlyRoute />}> {/*agr authenticated ho to dashboard shift ho jao*/}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Route>

                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password/:token" element={<ResetPassword />} />
                <Route path="/verify-email/:token" element={<VerifyEmail />} />
                <Route path="/learning" element={<Learning />}/>
                <Route path="/calculators" element={<Calculators />} />
                <Route path="/contact" element={<Contact />} />

                <Route element={<ProtectedRoute />}> 
                    <Route element={<DashboardLayout />}>
                        <Route path="/dashboard" element={<Dashboard />} /> 
                        <Route path="/credit-health" element={<CreditHealth />} />
                        <Route path="/goals" element={<Goals />} />
                        <Route path="/income" element={<Income />} />
                        <Route path="/expenses" element={<Expense />} />
                        <Route path="/assets" element={<Assets />} />
                        <Route path="/loans" element={<Loan />} />
                        <Route path="/reports" element={<Reports/>} />
                        <Route path="/notifications" element={<Notifications />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                    <Route element={<AILayout />}>
                        <Route path="/ai" element={<ArventraAI />} />
                    </Route>
                </Route>

                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
};

export default AppRoutes;