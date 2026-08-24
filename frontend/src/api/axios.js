import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    // Iska matlab roughly:
    //"Browser, agar is request ke saath relevant cookies hain, to unhe bhi bhejna."
    // Tumhara refresh token cookie mein hai.
    withCredentials: true,
});

// The access token lives here — in memory only, NOT localStorage — so it
// disappears on a hard refresh by design. authSlice/AuthInitializer are
// what re-populate it (via a silent refresh against the httpOnly cookie)
// after a reload; see AuthInitializer.jsx.
let accessToken = null;

export const setAccessToken = (token) => {
    accessToken = token;
};

//Agar kisi doosri file ko token chahiye:
// const token = getAccessToken();
// to current token mil jayega.
export const getAccessToken = () => accessToken;

api.interceptors.request.use((config) => {

    if (accessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
},
    (error) => Promise.reject(error)
);


// Ab maanlo ki Access token expire ho gaya.

// purpose:- Ek time pe sirf ONE refresh request chalani hai.
let refreshPromise = null;

const requestNewAccessToken = () => {
    // "Kya already refresh request chal rahi hai?"
    if (!refreshPromise) {
        // agr nhi to - 
        // Refresh EndPoint
        refreshPromise = axios
            .post(
                `${import.meta.env.VITE_API_URL}/users/refresh-token`,
                {},
                { withCredentials: true }
            )
            .then((response) => {
                const newToken = response.data.token;
                setAccessToken(newToken);
                return newToken;
            })
            .finally(() => {
                refreshPromise = null;
            });
    }
    return refreshPromise;
};

// A 401 now means "the 15-min access token expired" far more often than
// "the session is actually over" — so the default response to one is to
// silently refresh and retry, not to immediately boot the user out.

//response aane k baad
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error.response?.status;
        const url = originalRequest?.url || "";

        // In requests ko refresh nahi karna
        const isAuthEndpoint =
            url.includes("/users/login") ||
            url.includes("/users/register") ||
            url.includes("/users/refresh-token");
            
        // Ye basically bol raha hai:
        // Agar 401 mila
        // AND auth endpoint nahi hai
        // AND request pehle retry nahi hui
        // → refresh token se naya access token lao.
        if (status === 401 && !isAuthEndpoint && !originalRequest._retry) {
            originalRequest._retry = true; // never retry the same request twice 
            // (_retry ek flag bnaya h jese ki visited in dfs hota h ki dubara visit mt kro vesa)
            try {
                const newToken = await requestNewAccessToken();
                originalRequest.headers = originalRequest.headers || {};
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                // Refresh token is invalid/expired too — the session is
                // genuinely over. Full navigation (not react-router) so
                // Redux state resets cleanly rather than fighting
                // whatever's currently in memory.
                setAccessToken(null);
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login?sessionExpired=1";
                }
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;