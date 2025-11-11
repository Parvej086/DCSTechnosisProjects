import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar"; // you can customize for user
import FormsListPage from "./FormsListPage"; // <-- Add this
import Header from "../../components/Header";
import FillFormPage from "../admin/FillFormPage";
import UserSubmissionsPage from "./UserSubmissionsPage";
import PaymentReceiptPage from "../admin/PaymentReceiptPage";

import './UserDashboard.css';

const UserDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Loading dashboard...</div>;

  if (!user || user.role !== "User") return <Navigate to="/login" />;

  return (
    <div className="user-dashboard d-flex">
      <Sidebar /> {/* Optional: create a separate sidebar for user */}
      <div className="flex-grow-1">
        <Header userName={user.name} />

        <main className="content-area p-3">
          <Routes>
            {/* Default welcome page */}
            <Route
              index
              element={
                <div className="welcome-card card shadow-sm p-4 mt-3">
                  <h4 className="fw-bold mb-2">Welcome, {user.name}! 🎉</h4>
                  <p className="text-muted">
                    You are logged in as <strong>{user.role}</strong>.  
                    Use the sidebar to fill forms and check your submissions/payments.
                  </p>
                </div>
              }
            />

            {/* Nested routes */}
            <Route path="forms" element={<FormsListPage />} />
            <Route path="forms/fill/:id" element={<FillFormPage />} />
            <Route path="submissions" element={<UserSubmissionsPage />} />
            <Route path="payment/receipt/:paymentId" element={<PaymentReceiptPage />} />

            {/* Fallback for unmatched nested routes */}
            <Route
              path="*"
              element={
                <div className="text-center mt-5">
                  <h5>404 - Page Not Found</h5>
                </div>
              }
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
