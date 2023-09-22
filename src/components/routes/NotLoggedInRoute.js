import React from 'react'
import { Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'

import NoRedirect from './NoRedirect'

const NotLoggedInRoute = () => {
  const user = useSelector((state) => state.user)

  return user && user.token ? <NoRedirect /> : <Outlet />
}

export default NotLoggedInRoute
