import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // headers: {
    //     "Content-Type": "application/json"
    // }
});

api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if(token){
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
},
    (error) => Promise.reject(error)
);

// Global session-expiry handling: any 401 (expired/invalid JWT) clears the
// stale token and hard-redirects to /login. A 401 from /users/login itself
// is a normal "wrong password" response, not a session expiry, so it's
// excluded — that error is handled locally by the Login page instead.
api.interceptors.response.use(
    (response) => response,   //Ye successful response ke liye hai. (agr backend successful response de to)
    (error) => {
        const status = error.response?.status;
        const url = error.config?.url || "";   //This finds the URL that caused the error.
        const isLoginRequest = url.includes("/users/login");  //Check whether this was a login request

        if (status === 401 && !isLoginRequest && window.location.pathname !== "/login") {
            localStorage.removeItem("token");
            // Full navigation (not react-router) so Redux/AuthInitializer
            // If an authenticated request gets a 401, and we're not dealing with login itself, 
            // and the user isn't already on /login, treat it as an expired/invalid session.
            window.location.href = "/login?sessionExpired=1";  //It means: Browser ko login page par bhej do.
            //full browser navigation/reload. using window.location.href
        }

        return Promise.reject(error);
    }
);

export default api;