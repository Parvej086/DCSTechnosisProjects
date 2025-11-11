// src/components/Sidebar.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "../styles/Sidebar.css";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) return null;

  // Dynamically generate links based on role
  const navItems =
    user.role === "Admin"
      ? [
          { label: "Forms", path: "/admin-dashboard/forms" },
          { label: "Create Form", path: "/admin-dashboard/create-form" },
          { label: "Submissions", path: "/admin-dashboard/submissions" },
          { label: "Reset Password", path: "/reset-password" },
        ]
      : [
          { label: "Forms", path: "/user-dashboard/forms" },
          { label: "Submissions", path: "/user-dashboard/submissions" }
        ];

  return (
    <div className="sidebar d-flex flex-column p-3">
      <h4 className="text-white text-center mb-4 fw-bold">
        {user.role} Panel
      </h4>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`sidebar-link ${
            location.pathname === item.path ? "active" : ""
          }`}
        >
          {item.label}
        </Link>
      ))}
    </div>
  );
};

export default Sidebar;
