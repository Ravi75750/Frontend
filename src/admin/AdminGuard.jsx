import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * AdminGuard
 * Protects routes that require admin authentication.
 * Checks for 'adminToken' in localStorage.
 * If found, renders children. If not, redirects to /admin/login.
 */
const AdminGuard = ({ children }) => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
        return <Navigate to="/admin/login" replace />;
    }

    return children ? children : <Outlet />;
};

export default AdminGuard;
