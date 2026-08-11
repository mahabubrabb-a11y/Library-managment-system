
import { adminLayoutStyles as s } from "../assets/dummyStyle";
import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../Shared/AuthContext";
import logoSrc from "../assets/library-mark.svg";
import Sidebar from "../components/Sidebar";

const navItems = [
  {
    label: "Admin Dashboard",
    description: "Library office analytics",
    href: "/admin/dashboard",
    match: "/admin/dashboard",
    icon: "dashboard",
  },
  {
    label: "Books Page",
    description: "Inventory, fines, and returns",
    href: "/admin/books",
    match: "/admin/books",
    icon: "books",
  },
  {
    label: "Users Page",
    description: "Student-wise issue history",
    href: "/admin/users",
    match: "/admin/users",
    icon: "users",
  },
  {
    label: "Fine Page",
    description: "Overdue fine rules and settings",
    href: "/admin/fines",
    match: "/admin/fines",
    icon: "alerts",
  },
];

const AdminLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleConfirmLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  const footerItems = currentUser
    ? [
        {
          label: "Logout",
          icon: "login",
          kind: "primary",
          action: () => setIsLogoutOpen(true),
        },
      ]
    : [];

  return (
    <div style={layoutWrapperStyle}>
      {/* ১. একটিভ আইটেমের সাদা কার্ডের মধ্যে কালার ফিক্স করার CSS */}
      <style>{`
        /* Active White Box Fix */
        aside [data-active="true"],
        aside .active {
          background-color: #ffffff !important;
          color: #1a1a1a !important;
        }

        aside [data-active="true"] *,
        aside .active * {
          color: #1a1a1a !important;
        }

        aside [data-active="true"] p,
        aside [data-active="true"] span,
        aside .active p,
        aside .active span {
          color: #555555 !important;
        }

        /* Logout button styling to match screen reference */
        aside button, 
        aside .sidebar-footer button {
          background-color: #e2be7e !important;
          color: #1c2b26 !important;
          border: none !important;
          font-weight: 600 !important;
          border-radius: 20px !important;
        }
      `}</style>

      {/* ২. বামপাশের সাইডবার (ডার্ক ফরেস্ট গ্রিন) */}
      <aside style={sidebarWrapperStyle}>
        <Sidebar
          title="Library Office"
          subtitle="College admin controls"
          badge="ADMIN SECTION"
          navItems={navItems}
          footerItems={footerItems}
          accent="admin"
          logoSrc={logoSrc}
        />
      </aside>

      {/* ৩. ডানপাশের মূল এরিয়া (ক্রিম/ব্লাশ কালার) */}
      <main style={mainContentStyle}>
        <div style={{ width: "100%", height: "100%" }}>
          <Outlet />
        </div>
      </main>

      {/* ৪. Logout Modal Popup (অপশনাল, সুরক্ষার জন্য) */}
      {isLogoutOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalBoxStyle}>
            <div style={iconCircleStyle}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </div>

            <h3 style={{ margin: "12px 0 6px", color: "#991b1b", fontSize: "20px", fontWeight: "700" }}>
              Confirm Logout
            </h3>
            <p style={{ color: "#4b5563", fontSize: "14px", margin: "0 0 24px" }}>
              Are you sure you want to log out?
            </p>

            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button onClick={() => setIsLogoutOpen(false)} style={cancelBtnStyle}>
                Cancel
              </button>
              <button onClick={handleConfirmLogout} style={logoutBtnStyle}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- Exact Color Styles Matching Image ---

const layoutWrapperStyle = {
  display: "flex",
  minHeight: "100vh",
  width: "100vw",
  backgroundColor: "#f7f3e9", // ছবির ড্যাশবোর্ডের মূল ক্রিম কালার
};

const sidebarWrapperStyle = {
  width: "280px",
  backgroundColor: "#0e382c", // ছবির সাইডবারের ডার্ক গ্রিন
  color: "#ffffff",
  flexShrink: 0,
  minHeight: "100vh",
};

const mainContentStyle = {
  flexGrow: 1,
  padding: "32px",
  backgroundColor: "#f7f3e9",
  minHeight: "100vh",
  overflowY: "auto",
};

// Modal Styles
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(15, 23, 42, 0.65)",
  backdropFilter: "blur(4px)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalBoxStyle = {
  backgroundColor: "#ffffff",
  padding: "28px 24px",
  borderRadius: "16px",
  width: "360px",
  textAlign: "center",
  boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
  border: "1px solid #fca5a5",
};

const iconCircleStyle = {
  width: "56px",
  height: "56px",
  backgroundColor: "#fee2e2",
  borderRadius: "50%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  margin: "0 auto",
};

const cancelBtnStyle = {
  flex: 1,
  padding: "10px 16px",
  border: "1px solid #d1d5db",
  backgroundColor: "#f3f4f6",
  color: "#374151",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
};

const logoutBtnStyle = {
  flex: 1,
  padding: "10px 16px",
  border: "none",
  backgroundColor: "#dc2626",
  color: "#ffffff",
  borderRadius: "8px",
  fontWeight: "600",
  cursor: "pointer",
};

export default AdminLayout;