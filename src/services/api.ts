import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
 * Add JWT to every protected request.
 */
api.interceptors.request.use(
  (config) => {
    const storedAuth = localStorage.getItem("cloudfleet_auth");

    if (storedAuth) {
      try {
        const auth = JSON.parse(storedAuth);

        if (auth?.token) {
          config.headers.Authorization = `Bearer ${auth.token}`;
        }
      } catch (error) {
        console.error("Failed to read authentication:", error);

        localStorage.removeItem("cloudfleet_auth");
      }
    }

    return config;
  },

  (error) => {
    return Promise.reject(error);
  },
);

/*
 * Handle authentication failures.
 */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      /*
       * Don't redirect for login/register
       * failures because those should be
       * handled by the Login page.
       */
      const requestUrl = error.config?.url ?? "";

      const isAuthRequest =
        requestUrl.includes("/auth/login") ||
        requestUrl.includes("/auth/register");

      if (!isAuthRequest) {
        localStorage.removeItem("cloudfleet_auth");

        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
