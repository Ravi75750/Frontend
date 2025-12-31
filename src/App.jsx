// src/App.jsx
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// USER SIDE
import Header from "./components/Header";
import Hero from "./components/Hero";
import ContestList from "./components/ContestList";
import HowItWorks from "./components/HowItWorks";
import LoginPage from "./components/LoginPage";
import Footer from "./components/Footer";
import PaymentHistory from "./components/PaymentHistory";
import ResetPassword from "./components/ResetPassword";
import ForgotPassword from "./components/ForgotPassword"; // ✅ Added missing import
import { useUser } from "./components/UserContext";
import Highlights from "./components/Highlights";
import UserLayout from "./components/UserLayout";

// ADMIN
import AdminLayout from "./admin/AdminLayout";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import UsersPage from "./admin/UsersPage";
import ContestsPage from "./admin/ContestsPage";
import PaymentsPage from "./admin/PaymentsPage";
import CreateContest from "./admin/CreateContest";
import AddHighlight from "./admin/AddHighlight";
import AdminHighlights from "./admin/AdminHighlights";
import VerifyPayments from "./admin/VerifyPayment";
import AdminSettings from "./admin/AdminSettings";
import { AdminSearchProvider } from "./admin/AdminSearchContext";

export default function App() {
    const { user } = useUser();

    // 1. Initial State Check
    const [showModal, setShowModal] = useState(!user);
    const [mode, setMode] = useState(user ? "login" : "signup");
    const [joinedContest, setJoinedContest] = useState(false);

    // 🟢 Read admin token
    const isAdmin = localStorage.getItem("adminToken");

    // 2. Effect to sync modal with user login status
    useEffect(() => {
        // If on admin path, do not show user modal
        if (window.location.pathname.startsWith("/admin")) {
            setShowModal(false);
            return;
        }

        if (!user) {
            // Only force the modal on the home page, not on reset password pages
            const isResetPage = window.location.pathname.includes("password");
            if (!isResetPage) {
                setMode("signup");
                setShowModal(true);
            }
        } else {
            setShowModal(false);
        }
    }, [user, window.location.pathname]);

    // 3. Handlers
    const openLogin = () => { setMode("login"); setShowModal(true); };
    const openSignup = () => { setMode("signup"); setShowModal(true); };
    const openProfile = () => { setMode("profile"); setShowModal(true); };
    const handleCloseModal = () => setShowModal(false);

    // Blur main content if modal is open
    const mainContentClass = showModal ? "filter blur-sm pointer-events-none transition-all duration-300" : "transition-all duration-300";

    return (
        <>
            <Toaster position="top-center" reverseOrder={false} />

            <Router>
                <div className={mainContentClass}>
                    <Routes>
                        {/* USER AREA */}
                        <Route
                            path="/"
                            element={
                                <div>
                                    <Header
                                        onLoginClick={user ? openProfile : openLogin}
                                        onSignUpClick={user ? openProfile : openSignup}
                                    />
                                    <Hero />

                                    {user ? (
                                        <ContestList
                                            user={user}
                                            onJoinedContest={() => setJoinedContest(true)}
                                        />
                                    ) : (
                                        <div className="py-10 bg-[#143c46]">
                                            <p className="text-center text-red-400 text-lg">
                                                Please <button onClick={openLogin} className="text-[#9ce2f9] font-bold underline hover:text-white">Login</button> or <button onClick={openSignup} className="text-[#9ce2f9] font-bold underline hover:text-white">Sign Up</button> to view contests
                                            </p>
                                        </div>
                                    )}

                                    {user && joinedContest && <PaymentHistory userId={user._id} />}
                                    <HowItWorks />
                                    <Footer />
                                </div>
                            }
                        />

                        {/* Separate Auth Pages */}
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />

                        <Route
                            path="/highlights"
                            element={
                                <UserLayout
                                    openLogin={openLogin}
                                    openSignup={openSignup}
                                    openProfile={openProfile}
                                >
                                    <Highlights />
                                </UserLayout>
                            }
                        />

                        {/* ADMIN ROUTES */}
                        <Route path="/admin/login" element={<AdminLogin />} />

                        <Route
                            path="/admin/*"
                            element={
                                localStorage.getItem("adminToken") ? (
                                    <AdminSearchProvider>
                                        <AdminLayout />
                                    </AdminSearchProvider>
                                ) : (
                                    <Navigate to="/admin/login" replace />
                                )
                            }
                        >
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="users" element={<UsersPage />} />
                            <Route path="contests" element={<ContestsPage />} />
                            <Route path="payments" element={<PaymentsPage />} />
                            <Route path="create-contest" element={<CreateContest />} />
                            <Route path="add-highlight" element={<AddHighlight />} />
                            <Route path="verify-payments" element={<VerifyPayments />} />
                            <Route path="highlights" element={<AdminHighlights />} />
                            <Route path="settings" element={<AdminSettings />} />
                        </Route>

                        {/* Catch all redirect */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>

                {/* MODAL LAYER */}
                {showModal && (
                    <LoginPage mode={mode} onClose={handleCloseModal} />
                )}
            </Router>
        </>
    );
}
