const config = {
    // Centralized API URL configuration
    // Fallback to the Vercel backend if VITE_API_URL is not set
    API_URL: import.meta.env.VITE_API_URL || "https://backend-1sqampll9-ravi-sahanis-projects.vercel.app/api",
};

export default config;
