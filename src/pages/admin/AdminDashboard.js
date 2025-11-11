import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import FormsListPage from "./FormsListPage";
import FillFormPage from "./FillFormPage";
import CreateFormPage from "./CreateFormPage";
import SubmissionsPage from "./SubmissionsPage";
import UserSubmissionsPage from "./UserSubmissionsPage";
import PaymentSubmitPage from "./PaymentSubmitPage";
import PaymentReceiptPage from "./PaymentReceiptPage";

import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Loading dashboard...</div>;

  if (!user || user.role !== "Admin") return <Navigate to="/login" />;

  return (
    <div className="admin-dashboard d-flex">
      <Sidebar />
      <div className="flex-grow-1">
        <Header userName={user.name} />

        <main className="content-area p-3">
          <Routes>
            {/* Relative default route */}
            <Route
              index
              element={
                <div className="welcome-card card shadow-sm p-4 mt-3">
                  <h4 className="fw-bold mb-2">Welcome, {user.name}! 🎉</h4>
                  <p className="text-muted">
                    You are logged in as <strong>{user.role}</strong>.  
                    Use the sidebar to manage your forms, submissions, and payments.
                  </p>
                </div>
              }
            />

            <Route path="forms" element={<FormsListPage />} />
            <Route path="forms/fill/:id" element={<FillFormPage />} />
            <Route path="create-form" element={<CreateFormPage />} />
            <Route path="submissions" element={<SubmissionsPage />} />
            <Route path="submissions/form/:formId" element={<UserSubmissionsPage />} />
            <Route path="payment/:submissionId" element={<PaymentSubmitPage />} />
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

export default AdminDashboard;
