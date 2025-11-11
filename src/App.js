// src/App.js
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";
import ResetPasswordPage from "./pages/admin/ResetPasswordPage";

import "bootstrap/dist/css/bootstrap.css";
import "./styles/Login.css";

// Layout wrapper
const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login" || location.pathname === "/signup";
  const { user, logout, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div>
      {!hideLayout && (
        <header
          style={{
            padding: "10px",
            background: "#f5f5f5",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span>Welcome, {user?.name}</span>
          <button onClick={logout} className="btn btn-outline-danger">
            Logout
          </button>
        </header>
      )}
      <main>{children}</main>
    </div>
  );
};

// All routes
function AppRoutes() {
  const { user, loading } = useAuth();

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <Routes>
      {/* Default redirect */}
      <Route
        path="/"
        element={
          user ? (
            <Navigate to={`/${user.role.toLowerCase()}-dashboard`} replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/reset-password" element={<ResetPasswordPage />} />

      {/* Protected Admin Dashboard */}
      <Route
        path="/admin-dashboard/*"
        element={
          <PrivateRoute role="Admin">
            <AdminDashboard />
          </PrivateRoute>
        }
      />

      {/* Protected User Dashboard */}
      <Route
        path="/user-dashboard/*"
        element={
          <PrivateRoute role="User">
            <UserDashboard />
          </PrivateRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

// Main App
function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <AppRoutes />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
