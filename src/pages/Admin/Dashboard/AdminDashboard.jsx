import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { BsPlayBtn } from 'react-icons/bs'
import { LinkOutlined } from '@ant-design/icons'
import Navbar from '../../../components/nav/Navbar'
import HeaderProfile from '../../../components/HeaderProfile'
import WebNavBar from '../../../components/nav/WebNavBar'
import Footer from '../../../components/footer/Footer'
import AdminSidebar from '../../../components/sidebar/AdminSidebar'
import { useStateContext } from '../../../components/contexts/ContextProvider'
import UserSidebar from '../../../components/sidebar/UserSidebar'

const AdminDashboard = () => {
  const user = useSelector((state) => state.user)
  const { activeMenu } = useStateContext()
  return (
    <>
      <WebNavBar />
      <div className="flex relative container mx-auto pt-1">
        {activeMenu ? (
          <div className="w-72 sidebar dark:bg-secondary-dark-bg bg-white ">
            <UserSidebar />
          </div>
        ) : (
          <div className="w-0 dark:bg-secondary-dark-bg">
            <UserSidebar />
          </div>
        )}
        <div
          className={
            activeMenu
              ? 'dark:bg-main-dark-bg  bg-main-bg min-h-screen w-full  '
              : 'bg-main-bg dark:bg-main-dark-bg  w-full min-h-screen flex-2 '
          }
        >
          <div className="md:static bg-main-bg dark:bg-main-dark-bg navbar w-full ">
            <Navbar />
          </div>
          <div>
            <div className="m-2 md:m-10 p-2 md:p-5 bg-white rounded-1xl">
              <HeaderProfile title={`Welcome  ${user?.name}`} />
              <div className="mt-10">
                <div className="flex flex-wrap lg:flex-nowrap justify-start ">
                  <div className="flex m-3 flex-wrap justify-center gap-1 items-center">
                    <div className="relative bg-gray-100 h-44 dark:text-gray-200 dark:bg-secondary-dark-bg w-56  p-4 pt-5 rounded-2xl ">
                      <button
                        type="button"
                        style={{
                          color: '#1D4ED8',
                          backgroundColor: '#ddd',
                        }}
                        className="text-2xl opacity-0.9 rounded-full  p-4 hover:drop-shadow-xl"
                      >
                        <BsPlayBtn size={30} />
                      </button>

                      <div className="text-gray-600 text-sm font-semibold my-3">
                        <p className="float-left">Plan</p>
                        <p className="float-right">(0)</p>
                      </div>

                      <div className="clear-both"></div>
                      <div className="flex space-x-2 text-gray-400 text-sm my-4">
                        <LinkOutlined
                          style={{
                            fontSize: '20px',
                          }}
                        />
                        <NavLink to={`/plan`}> Plan</NavLink>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default AdminDashboard
