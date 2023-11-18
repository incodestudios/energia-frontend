import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai'
import { googleLogout } from '@react-oauth/google'

const WebNavBar = () => {
  let Links = [
    { name: 'HOME', path: '/' },
    { name: 'SERVICE', path: '/services' },
    { name: 'ABOUT', path: '/about' },
    { name: 'PRICING', path: '/pricing' },
    { name: 'CONTACT', path: '/contact' },
  ]
  let [open, setOpen] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [openDrop, setOpenDrop] = useState(false)
  const divRef = useRef()
  const user = useSelector((state) => state.user)

  const [scroll, setScroll] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScroll(true)
      } else {
        setScroll(false)
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setOpenDrop(false)
      }
    }

    window.addEventListener('mouseup', handleClickOutside)

    return () => {
      window.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])

  const logout = () => {
    Cookies.remove('user')
    dispatch({
      type: 'LOGOUT',
      payload: null,
    })
    navigate('/login')
  }

  const logoutGoogle = () => {
    googleLogout()
    Cookies.remove('user')
    dispatch({
      type: 'LOGOUT',
      payload: null,
    })
    navigate('/login')
  }

  const activeLink =
    'block py-2 pl-2 pr-4 text-white text-base rounded md:bg-transparent md:hover:bg-transparent md:hover:text-sky-500 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 duration-500'

  const normalLink =
    'block py-2 pl-2 pr-4 text-white text-base rounded md:bg-transparent hover:bg-sky-500 md:hover:bg-transparent md:hover:text-sky-500 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700 duration-500'

  return (
    <div
      className={
        scroll
          ? 'flex items-center justify-center fixed top-0 left-0 w-full h-16 z-50 transition-all duration-500 bg-slate-800'
          : 'flex justify-between items-center h-20 mx-auto px-4 text-white relative z-50 transition-all duration-300 bg-gray-900 w-full'
      }
    >
      <nav className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between mx-auto p-2">
          <Link to="/" as={NavLink} className="flex items-center">
            <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
              Energis
            </span>
          </Link>

          <div ref={divRef} className="relative flex items-center md:order-2">
            {!user ? (
              <div className="flex justify-between">
                <Link
                  to="/login"
                  as={NavLink}
                  className="inline-flex items-center justify-center  rounded-lg text-md px-3 py-1.5 focus:outline-none mx-6 text-white"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  as={NavLink}
                  className="inline-flex items-center justify-center text-white bg-sky-500 hover:bg-sky-400 text-md px-3 py-1.5 focus:outline-none mr-2"
                >
                  Register
                </Link>
              </div>
            ) : (
              <button
                type="button"
                className="flex mr-3 text-sm bg-gray-800 rounded-full md:mr-0 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600"
                id="user-menu-button"
                aria-expanded="false"
                data-dropdown-toggle="user-dropdown"
                data-dropdown-placement="bottom"
                onClick={() => setOpenDrop(!openDrop)}
              >
                <span className="sr-only">Open user menu</span>
                <img
                  className="w-8 h-8 rounded-full"
                  src={user?.img}
                  alt="Profile"
                />
              </button>
            )}

            {openDrop && (
              <div className="absolute mt-56 origin-top-right right-0 z-50 my-4 text-base list-none bg-white divide-y divide-gray-100 rounded-lg shadow dark:bg-gray-700 dark:divide-gray-600 transition-all duration-500 ease-in">
                <div className="px-4 py-3">
                  <span className="block text-sm text-gray-900 dark:text-white">
                    {user?.name}
                  </span>
                  <span className="block text-sm  text-gray-500 truncate dark:text-gray-400">
                    {user?.email}
                  </span>
                </div>
                <ul className="py-2" aria-labelledby="user-menu-button">
                  <button
                    onClick={() => {
                      navigate(
                        `${
                          user && user.role === 'admin'
                            ? '/admin/dashboard'
                            : '/dashboard'
                        }`
                      )
                      setOpenDrop(false)
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                  >
                    Dashboard
                  </button>

                  <li>
                    <button
                      onClick={() => {
                        setOpenDrop(false)
                        user?.google ? logoutGoogle() : logout()
                      }}
                      type="button"
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-200 dark:hover:text-white"
                    >
                      Sign out
                    </button>
                  </li>
                </ul>
              </div>
            )}

            <button
              data-collapse-toggle="navbar-user"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden  focus:outline-none "
              aria-controls="navbar-user"
              aria-expanded="false"
              onClick={() => setOpen(!open)}
            >
              {!open ? (
                <AiOutlineMenu size={25} />
              ) : (
                <AiOutlineClose size={25} />
              )}
            </button>
          </div>

          <ul
            className={`md:flex md:items-center md:pb-0 pb-12 md:static md:z-auto left-0  md:w-auto navbar-web   ${
              open
                ? 'fixed left-0 top-0 w-[60%] h-full bg-gray-900 ease-in-out duration-500'
                : 'ease-in-out duration-500 fixed left-[-100%]'
            }`}
          >
            {Links.map((link, i) => (
              <li
                key={i}
                className="md:ml-8 sm:ml-0 text-base md:my-0 my-2 flex-shrink-0"
              >
                <NavLink
                  to={`${link.path}`}
                  key={link.id}
                  className={({ isActive }) =>
                    isActive ? `${activeLink}` : `${normalLink}`
                  }
                  style={({ isActive }) => ({
                    color: isActive ? '#0FBCF9' : '',
                  })}
                >
                  <span className="capitalize ">{link.name}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </div>
  )
}

export default WebNavBar
