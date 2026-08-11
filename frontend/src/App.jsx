import React from 'react'
import Home from './pages/Home'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ProtectedRoute from './Shared/ProtectedRoute'
import AdminLayout from './admin/AdminLayout'
import AdminDashboard from './admin/AdminDashboard'
import AdminBookPage from './admin/AdminBookPage'
import AdminUserPage from './admin/AdminUserPage'
import AdminFinesPage from './admin/AdminFinesPage'
import UserDashboardPage from './user/UserDashboardPage'
import UserLayout from './user/UserLayout'
import UserBookCard from './user/UserBookCard'
import UserBooksPage from './user/UserBooksPage'
import UserEditProfilePage from './user/UserEditProfilePage'


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login/>}/>
      <Route path='/signup' element={<Signup/>}/>

      {/* Protected Routes */}
      {/* ADMIN */}
      <Route element={<ProtectedRoute allowedRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path='books' element={<AdminBookPage/>}/>
          <Route path='users' element={<AdminUserPage/>}/>
          <Route path='fines' element={<AdminFinesPage/>}/>
        </Route>
      </Route>

      {/* USER */}
      <Route element={<ProtectedRoute allowedRole="user"/>}>
        <Route path='/user' element={<UserLayout />}>
          <Route index element={<Navigate to="/user/dashboard" replace />}/>
          <Route path='dashboard' element={<UserDashboardPage/>}/>
          <Route path='books' element={<UserBooksPage/>}/>
          <Route path='profile' element={<UserEditProfilePage/>}/>
        </Route>
      </Route>

     <Route path='*' element={<Navigate to='/' replace />}/>

    </Routes>
  )
}

export default App
