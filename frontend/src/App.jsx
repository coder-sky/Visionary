import React from 'react'
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'

import Home from './components/User/Home'
import Dashboard from './components/Admin/Dashboard'
import Users from './components/Admin/Users'
import { UserProvider } from './components/Common/Context/UserContext'
import AdminProtectedRoute from './components/Common/ProtectedRoutes/AdminProtectedRoute'
import UserProtectedRoute from './components/Common/ProtectedRoutes/UserProtectedRoutes'
import Profile from './components/Common/Profile'
import ChangePassword from './components/Common/ChangePassword'
import CommonProtectedRoutes from './components/Common/ProtectedRoutes/CommonProtectedRoutes'
import ChartForm from './components/User/ChartForm'

 
function App() {


  return (
    <>
    
    <BrowserRouter>
    <UserProvider>
    <Routes>
      <Route path='/' element={<Navigate to='/home' />} />
      <Route path='/login' element={<Login/>} />
      <Route path='/register' element={<Register />} />
      <Route path='/profile' element={<CommonProtectedRoutes><Profile /></CommonProtectedRoutes>} />
      <Route path='/change-password' element={<CommonProtectedRoutes><ChangePassword /></CommonProtectedRoutes>} />
      <Route path='/home' element={<UserProtectedRoute><Home/></UserProtectedRoute>} />
      <Route path='/dashboard'  element={<AdminProtectedRoute><Dashboard/></AdminProtectedRoute>} />
      <Route path='/users' element={<AdminProtectedRoute><Users/></AdminProtectedRoute>} />
      <Route path='/charts-creation' element={<UserProtectedRoute><ChartForm/></UserProtectedRoute>} />
     
       
    </Routes>
    </UserProvider>
    </BrowserRouter>

    </>
  )
}

export default App
