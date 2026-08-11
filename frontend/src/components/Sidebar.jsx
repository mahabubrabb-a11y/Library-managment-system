import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Shared/AuthContext";
import { sidebarStyles as s } from "../assets/dummyStyle";
import {
  Bell,
  BookCopy,
  ChartNoAxesCombined,
  ChevronRight,
  Menu,
  ShieldCheck,
  UserRound,
  X,
  LogOut
} from "lucide-react";

// আগের আইকন ম্যাপিং সিস্টেম
const iconMap = {
  dashboard: ChartNoAxesCombined,
  books: BookCopy,
  alerts: Bell,
  admin: ShieldCheck,
  users: UserRound,
};

const Sidebar = ({
  title,
  subtitle,
  badge,
  navItems = [],
  footerItems = [],
  accent = "user",
  logoSrc
}) => {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const { logout } = useAuth();
  const navigate = useNavigate();

  const badgeStyles = accent === "admin" ? s.badgeAdmin : s.badgeUser;

  // লগআউট হ্যান্ডলার
  const handleLogout = () => {
    if (logout) {
      logout();
    } else {
      localStorage.removeItem("token");
    }
    navigate("/login");
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={s.mobileMenuButton}
      >
        <Menu size={18} />
      </button>

      {/* Mobile Overlay */}
      <div
        className={`${s.mobileOverlay} ${
          open ? s.mobileOverlayOpen : s.mobileOverlayClosed
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar Container */}
      <aside
        className={`${s.sidebar} ${
          open ? s.sidebarOpen : s.sidebarClosed
        }`}
      >
        {/* Header Section */}
        <div className={s.sidebarHeader}>
          <div className="min-w-0 pr-3">
            <div className={s.logoWrapper}>
              {logoSrc ? (
                <img src={logoSrc} alt="logo" className={s.logoImage} />
              ) : (
                <BookCopy size={22} />
              )}
            </div>
            <h2 className={s.title}>{title}</h2>
            <p className={s.subtitle}>{subtitle}</p>
            {badge && (
              <span className={`${s.badgeBase} ${badgeStyles}`}>
                {badge}
              </span>
            )}
          </div>

          <button
            onClick={() => setOpen(false)}
            type="button"
            className={s.closeButton}
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation Section */}
        <nav className={s.nav}>
          {navItems.map((item) => {
            // আইকন নাম দিয়ে iconMap থেকে রেন্ডার করা হচ্ছে
            const Icon = iconMap[item.icon] ?? ChevronRight;
            const active =
              location.pathname === item.href ||
              (item.match ? location.pathname.startsWith(item.match) : false);

            return (
              <Link
                key={item.label}
                to={item.href}
                onClick={() => setOpen(false)}
                className={`${s.navLink} ${
                  active ? s.navLinkActive : s.navLinkInactive
                }`}
              >
                <span
                  className={`${s.navIconWrapper} ${
                    active
                      ? s.navIconWrapperActive
                      : s.navIconWrapperInactive
                  }`}
                >
                  <Icon size={18} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className={s.navLabel}>{item.label}</span>
                  {item.description && (
                    <span
                      className={`${s.navDescription} ${
                        active
                          ? s.navDescriptionActive
                          : s.navDescriptionInactive
                      }`}
                    >
                      {item.description}
                    </span>
                  )}
                </span>

                <ChevronRight
                  size={16}
                  className={
                    active ? s.navChevronActive : s.navChevronInactive
                  }
                />
              </Link>
            );
          })}
        </nav>

        {/* Footer Section (Logout Handler) */}
        <div className={s.footer}>
          {footerItems.map((item, index) => {
            const isPrimary = item.variant === "primary";
            const btnClass = isPrimary
              ? s.footerButtonPrimary
              : s.footerButtonSecondary;

            const isLogoutBtn = item.label?.toLowerCase() === "logout";

            return (
              <button
                key={index}
                type="button"
                onClick={() => {
                  if (isLogoutBtn) {
                    handleLogout();
                  } else if (item.onClick) {
                    item.onClick();
                  }
                  setOpen(false);
                }}
                className={`${s.footerButton} ${btnClass}`}
              >
                <span className={s.footerIconWrapper}>
                  {isLogoutBtn && <LogOut size={16} style={{ marginRight: '6px' }} />}
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;


