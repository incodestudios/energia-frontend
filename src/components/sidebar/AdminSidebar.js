import { NavLink, useNavigate } from 'react-router-dom'

import { LogoutOutlined } from '@ant-design/icons'

import { AiOutlineDashboard } from 'react-icons/ai'
import { MdOutlineCancel, MdSettingsSuggest } from 'react-icons/md'
import { PiUsersFourFill } from 'react-icons/pi'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { useStateContext } from '../contexts/ContextProvider'
import { BiCalendar } from 'react-icons/bi'
import { googleLogout } from '@react-oauth/google'
import { BsListCheck } from 'react-icons/bs'

const AdminSidebar = () => {
  const { activeMenu, setActiveMenu, screenSize } = useStateContext()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const navigation = useNavigate()

  const links = [
    {
      id: 1,
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: <AiOutlineDashboard />,
    },
    {
      id: 2,
      path: '/admin/categories',
      name: 'Categories',
      icon: <BsListCheck />,
    },
    {
      id: 3,
      path: '/settings',
      name: 'Settings',
      icon: <MdSettingsSuggest />,
    },
  ]

  const logout = () => {
    Cookies.remove('user')
    dispatch({
      type: 'LOGOUT',
      payload: null,
    })
    navigation('/login')
  }

  const logoutGoogle = () => {
    googleLogout()
    Cookies.remove('user')
    dispatch({
      type: 'LOGOUT',
      payload: null,
    })
    navigation('/login')
  }

  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false)
    }
  }

  const activeLink =
    'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2'
  const normalLink =
    'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2'

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10">
      {activeMenu && (
        <>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => setActiveMenu(!activeMenu)}
              className="text-xl rounded-full p-3 mt-4 block md:hidden"
            >
              <MdOutlineCancel />
            </button>
          </div>
          <div className="mt-5">
            {links.map((link) => {
              return (
                <NavLink
                  to={`${link.path}`}
                  key={link.id}
                  onClick={handleCloseSideBar}
                  className={({ isActive }) =>
                    isActive
                      ? `${activeLink} link_dash_act`
                      : `${normalLink} link_dash`
                  }
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? '#1D4ED8' : '',
                  })}
                >
                  {link.icon}
                  <span className="capitalize ">{link.name}</span>
                </NavLink>
              )
            })}

            <NavLink
              to="/"
              onClick={() => (user?.google ? logoutGoogle() : logout())}
              className={normalLink}
            >
              <LogoutOutlined />
              <span className="capitalize ">Logout</span>
            </NavLink>
          </div>
        </>
      )}
    </div>
  )
}

export default AdminSidebar
