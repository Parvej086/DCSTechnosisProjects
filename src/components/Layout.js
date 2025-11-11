import React from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }) => {
  const location = useLocation();
  const hideLayout = location.pathname === "/login";
  const { user, logout } = useAuth();

  return (
    <div>
      {!hideLayout && (
        <header style={{ padding: "10px", background: "#eee", display: "flex", justifyContent: "space-between" }}>
          <span>{user ? `Welcome, ${user.email}` : ""}</span>
          {user && <button onClick={logout}>Logout</button>}
        </header>
      )}
      <main>{children}</main>
    </div>
  );
};

export default Layout;
