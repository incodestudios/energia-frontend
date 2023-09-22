import { useEffect, useState, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route, useNavigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import UserRoute from './components/routes/UserRoute'
import AdminRoute from './components/routes/AdminRoute'
import NotLoggedInRoute from './components/routes/NotLoggedInRoute'
import Register from './pages/Auth/Register'
import Login from './pages/Auth/Login'
import Home from './pages/Home/Home'
import NotFound from './pages/NotFound/NotFound'
import Dashboard from './pages/User/Dashboard/Dashboard'
import WebNavBar from './components/nav/WebNavBar'

function App() {
  return (
    <div className="w-full mx-auto">
      <WebNavBar />
      <ToastContainer />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route element={<NotLoggedInRoute />}>
          <Route exact path="/register" element={<Register />} />
          <Route exact path="/login" element={<Login />} />
        </Route>
        <Route element={<UserRoute />}>
          <Route exact path="/dashboard" element={<Dashboard />} />
        </Route>
        <Route element={<AdminRoute />}></Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  )
}

export default App
