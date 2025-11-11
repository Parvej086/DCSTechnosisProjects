// src/components/Header.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../services/authService";
import "../styles/Header.css";


const Header = ({ userName, setUser }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="header d-flex justify-content-between align-items-center px-4 shadow-sm">
      <h5 className="fw-bold m-0 text-primary">Exam Management System</h5>
      <div className="d-flex align-items-center gap-3">
        <span className="fw-semibold text-dark">👋 {userName}</span>
        <button className="btn btn-outline-danger btn-sm" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Header;
