import api from "../api/axios";

export const login = async(data)=>{
    const response = await api.post("/users/login", data);
    return response.data;
};

export const register = async(data)=>{
    const response = await api.post("/users/register", data);
    return response.data;
};

export const getCurrentUser = async () => { 
    const response = await api.get("/users/me"); 
    return response.data; 
};

export const forgotPassword = async (email) => {
    const response = await api.post("/users/forgot-password", { email });
    return response.data;
};

export const resetPassword = async (token, password) => {
    const response = await api.post(`/users/reset-password/${token}`, { password });
    return response.data;
};

export const verifyEmail = async (token) => {
    const response = await api.post(`/users/verify-email/${token}`);
    return response.data;
};

export const resendVerification = async (email) => {
    const response = await api.post("/users/resend-verification", { email });
    return response.data;
};

export const logout = async(data)=>{
    const response = await api.post("/users/logout", data);
    return response.data;
};

export const refreshAccessToken = async(data)=>{
    const response = await api.post("/users/refresh-token");
    return response.data;
};