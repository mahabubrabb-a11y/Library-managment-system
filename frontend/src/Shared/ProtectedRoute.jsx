import React from 'react';
import { protectedRouteStyles as s } from '../assets/dummyStyle';
import { useAuth } from '../Shared/AuthContext';
import { useLocation, Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  const { currentUser, ready } = useAuth();
  const location = useLocation();

  // ১. Auth state চেক বা লোড হচ্ছে কি না
  if (!ready) {
    console.log("Protected Route: Auth not ready yet");
    return (
      <div className={s.loadingContainer}>
        <div className={s.loadingCard}>
          Loading your library workspace...
        </div>
      </div>
    );
  }

  // ২. ইউজার লগইন না থাকলে /login পেজে পাঠাবে
  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // ৩. ইউজারের রোল মিলে কি না চেক করা (যেমন: Admin নাকি Student)
  if (allowedRole && currentUser.role !== allowedRole) {
    const redirectPath = currentUser.role === 'admin' ? '/admin/dashboard' : '/user/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // ৪. সব ঠিক থাকলে সংরক্ষিত পেজ বা চাইল্ড কম্পোনেন্ট দেখাবে
  return <Outlet />;
};

export default ProtectedRoute;