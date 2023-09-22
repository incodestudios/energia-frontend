import React, { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import ToRedirect from './ToRedirect'

const AdminRoute = () => {
  const user = useSelector((state) => state.user)
  const [ok, setOk] = useState(false)

  useEffect(() => {
    if (user && user?.role === 'admin') {
      setOk(true)
    } else {
      setOk(false)
    }
  }, [user])

  return ok ? <Outlet /> : <ToRedirect />
}

export default AdminRoute
