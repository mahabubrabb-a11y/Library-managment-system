import React from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { userLayoutStyles as s } from '../assets/dummyStyle';
import logoSrc from '../assets/library-mark.svg';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../Shared/AuthContext'; 

const navItems = [
  {
    label: "Student Dashboard",
    description: "Your college library overview",
    href: "/user/dashboard",
    match: "/user/dashboard",
    icon: "dashboard",
  },
  {
    label: "Books Page",
    description: "Issued books, fines, and due dates",
    href: "/user/books",
    match: "/user/books",
    icon: "books",
  },
  {
    label: "Edit Profile",
    description: "Update your student information",
    href: "/user/profile",
    match: "/user/profile",
    icon: "users",
  },
];

const UserLayout = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const footerItems = currentUser
    ? [
        {
          label: "Logout",
          icon: "login",
          variant: "primary", 
          onClick: () => {   
            logout();
            navigate("/login");
          },
        },
      ]
    : [];

  return (
    <div className={s.layoutContainer}>
      <Sidebar
        title="Student Desk"
        subtitle="College library access"
        badge="Student section"
        navItems={navItems}
        footerItems={footerItems}
        logoSrc={logoSrc}
      />
      
      <main className={s.mainContent}>
        <div className={s.innerContainer}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default UserLayout;
