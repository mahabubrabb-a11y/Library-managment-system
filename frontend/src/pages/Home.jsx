import React, { createElement } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { ArrowRight, BookMarked, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '../Shared/AuthContext';
import { homeStyles as s } from '../assets/dummyStyle';

const navItems = [
  {
    label: "Student Dashboard",
    description: "Open issued books, fines, and profile details",
    href: "/user/dashboard",
    match: "/user",
    icon: "dashboard",
  },
  {
    label: "Admin Dashboard",
    description: "Manage student issues, returns, and fines",
    href: "/admin/dashboard",
    match: "/admin",
    icon: "admin",
  },
];

const features = [
  {
    icon: BookMarked,
    title: "Manual book issuing",
    text: "Track manual book issues, due dates, returns, and dynamic fine calculations in one workflow.",
  },
  {
    icon: Users,
    title: "Student self-service",
    text: "Students can review borrowed books, pending fines, academic details, and recent activity quickly.",
  },
  {
    icon: ShieldCheck,
    title: "Admin desk controls",
    text: "Library staff can manage student records, manual book issues, overdue items, and fine settings from the admin area.",
  },
];

const Home = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const footerItems = currentUser 
    ? [
        {
          label: "Logout",
          icon: "login",
          kind: "primary",
          onClick: () => {
            logout();
            navigate("/");
          },
        },
      ]
    : [
        { label: "Login", href: "/login", icon: "login", kind: "primary" },
        {
          label: "Sign Up",
          href: "/signup",
          icon: "signup",
          kind: "secondary",
        },
      ];

  return (
    <div className={s.layoutContainer}>
      <Sidebar
        title="ShelfWise"
        subtitle="Library management portal"
        badge="Beautiful theme"
        navItems={navItems}
        footerItems={footerItems}
      />

      {/* Bold Dark Green Background */}
      <main className={`${s.mainContent} bg-[#0a231b]`}>
        <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
          
          {/* Hero Section */}
          <section className="bg-[#0f2e24] rounded-2xl p-6 border border-emerald-800/40 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
              
              {/* Left Column */}
              <div className="md:col-span-7 space-y-3">
                <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
                  Library Management Website
                </span>
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white leading-snug">
                  Manage students, books, returns, and fines in one library dashboard.
                </h1>
                <p className="text-sm text-emerald-100/70 leading-relaxed max-w-lg">
                  This library management portal gives students a focused borrowing dashboard and gives admins a practical workspace for manual circulation, user records and overdue tracking.
                </p>

                <div className="flex flex-wrap gap-3 pt-2">
                  {currentUser ? (
                    <Link
                      to={currentUser.role === "admin" ? "/admin/dashboard" : "/user/dashboard"}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full hover:bg-emerald-400 transition"
                    >
                      Go To Dashboard
                      <ArrowRight size={14} />
                    </Link>
                  ) : (
                    <>
                      <Link 
                        to="/signup" 
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-emerald-300 hover:text-white transition"
                      >
                        Create Account
                        <ArrowRight size={14} />
                      </Link>
                      <Link 
                        to="/login" 
                        className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-slate-950 text-xs font-bold rounded-full hover:bg-emerald-400 transition"
                      >
                        Login Now
                        <ArrowRight size={14} />
                      </Link>
                    </>
                  )}
                </div>
              </div>

              {/* Right Column (Info Card) */}
              <div className="md:col-span-5">
                <div className="bg-[#143d30] border border-emerald-700/30 rounded-xl p-5 space-y-2">
                  <p className="text-[10px] font-bold tracking-wider text-emerald-400 uppercase">
                    LIBRARY WORKFLOW
                  </p>
                  <p className="text-base font-semibold text-white leading-snug">
                    Seperate student and admin dashboards built for daily library operations.
                  </p>
                  <p className="text-xs text-emerald-100/70 leading-relaxed">
                    Monitor issue activity, keep profile records updated, and track overdue follow-up without leaving the system.
                  </p>
                </div>
              </div>

            </div>
          </section>

          {/* Features Grid Section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {features.map(({ icon, title, text }) => (
              <article 
                key={title} 
                className="bg-[#0f2e24] border border-emerald-800/40 rounded-xl p-5 space-y-2 hover:border-emerald-600/50 transition"
              >
                <span className="inline-flex p-2 bg-[#164234] text-emerald-400 rounded-lg border border-emerald-700/30">
                  {createElement(icon, { size: 18 })}
                </span>
                <h2 className="text-sm font-semibold text-white">{title}</h2>
                <p className="text-xs text-emerald-100/70 leading-relaxed">{text}</p>
              </article>
            ))}
          </section>

        </div>
      </main>
    </div>
  );
};

export default Home;



































/**import React from 'react'
import Sidebar from '../components/Sidebar'
import { BookMarked, ShieldCheck, Users } from 'lucide-react';
import { useAuth } from '../Shared/AuthContext';
import {homeStyles as s} from '../assets/dummyStyle'

const navItems = [
  {
    label: "Student Dashboard",
    description: "Open issued books, fines, and profile details",
    href: "/user/dashboard",
    match: "/user",
    icon: "dashboard",
  },
  {
    label: "Admin Dashboard",
    description: "Manage student issues, returns, and fines",
    href: "/admin/dashboard",
    match: "/admin",
    icon: "admin",
  },
];

const features = [
  {
    icon: BookMarked,
    title: "Manual book issuing",
    text: "Track manual book issues, due dates, returns, and dynamic fine calculations in one workflow.",
  },
  {
    icon: Users,
    title: "Student self-service",
    text: "Students can review borrowed books, pending fines, academic details, and recent activity quickly.",
  },
  {
    icon: ShieldCheck,
    title: "Admin desk controls",
    text: "Library staff can manage student records, manual book issues, overdue items, and fine settings from the admin area.",
  },
];

const Home = ()=> {
   const {currentUser, logout} = useAuth();

  const footerItems = currentUser 
    ? [
        {
          label: "Logout",
          icon: "login",
          kind: "primary",
          action: () => {
            logout();
            navigate("/");
          },
        },
      ]
    : [
        { label: "Login", href: "/login", icon: "login", kind: "primary" },
        {
          label: "Sign Up",
          href: "/signup",
          icon: "signup",
          kind: "secondary",
        },
      ];
        
  return (
    <div className={s.layoutContainer}>
      <Sidebar
      title="ShelfWise"
        subtitle="Library management portal"
        badge="Beautiful theme"
        navItems={navItems}
        footerItems={footerItems}
      
      
      />

      <main className={s.mainContent}>
        <div className={s.innerContainer}>
          <section className={s.heroSection}>
            <div className={s.heroGrid}>
              <div>
                <span className={s.heroBadge}>Library management system</span>
              </div>
            </div>
          </section>
        </div>
      </main>
      
    </div>
  )
}

export default Home**/
