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
import Settings from './pages/User/Dashboard/Settings'
import TrainerRoute from './components/routes/TrainerRoute'
import Clients from './pages/User/Trainer/Clients'
import AddClient from './pages/User/Trainer/AddClient'
import TokenHandler from './components/handler/TokenHandler'
import Schedule from './pages/User/Trainer/Schedule'
import ClientSchedule from './pages/User/Client/ClientSchedule'
import PublicProfile from './pages/Profile/PublicProfile'
import AdminDashboard from './pages/Admin/Dashboard/AdminDashboard'
import AdminCategories from './pages/Admin/Categories/AdminCategories'
import { getCategories } from './components/functions/categories'
import { Lottie } from '@crello/react-lottie'
import { CheckCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons'
import animationData from './assets/loader.json'
import Select from 'react-dropdown-select'
import Cookies from 'js-cookie'
import { googleLogout } from '@react-oauth/google'
import { updateTrainerCat } from './components/functions/user'
import AdminPriceList from './pages/Admin/PriceList/AdminPriceList'
import ScheduleDetails from './pages/Schedule/ScheduleDetails'
import Checkout from './pages/Booking/Checkout'
import NextPayment from './pages/User/Trainer/NextPayment'

function App() {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [successModal, setSuccessModal] = useState('')
  const [errorModal, setErrorModal] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const getData = async () => {
    try {
      setLoading(true)
      const res = await getCategories(setError)
      if (res.status === 200) {
        setData(res?.data?.categories)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  useEffect(() => {
    if (user && user?.role === 'trainer' && user?.categories?.length === 0) {
      setShowModal(true)
    } else {
      setShowModal(false)
    }
  }, [user])

  const closeModal = () => {
    setSuccessModal('')
    setErrorModal('')
    setShowModal(false)
  }

  const logout = () => {
    Cookies.remove('user')
    dispatch({
      type: 'LOGOUT',
      payload: null,
    })
    localStorage.removeItem('bookingDetails')
    navigate('/login')
  }

  const logoutGoogle = () => {
    googleLogout()
    Cookies.remove('user')
    dispatch({
      type: 'LOGOUT',
      payload: null,
    })
    localStorage.removeItem('bookingDetails')
    navigate('/login')
  }

  const updateCategories = async (e) => {
    e.preventDefault()

    const newData = {
      categories: categories?.map((c) => c._id),
    }
    try {
      setLoadingModal(true)
      const res = await updateTrainerCat(newData, user?.token, setErrorModal)

      if (res && res.status === 200) {
        setSuccessModal(res.data.message)
        setTimeout(() => {
          dispatch({
            type: 'LOGIN',
            payload: { ...user, categories: newData.categories },
          })

          const updatedUser = { ...user, categories: newData.categories }
          Cookies.set('user', JSON.stringify(updatedUser), {
            expires: 30,
          })

          closeModal()
          navigate('/dashboard')
        }, 1500)
      } else {
        setErrorModal('Failed to update categories')
      }
      setLoadingModal(false)
    } catch (error) {
      setLoadingModal(false)
    }
  }

  return (
    <div className="w-full mx-auto">
      <ToastContainer />

      {user && user?.role === 'trainer' && user?.categories?.length === 0 ? (
        <div>
          {showModal && (
            <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
              <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-1/2 pb-2 overflow-y-auto max-h-[100vh]">
                <div className="bg-gray-100 border-b px-4 py-6 flex justify-between items-center rounded-lg">
                  <h3 className="font-semibold text-xl text-stone-600">
                    Please specify your categories.
                  </h3>
                </div>

                <div className="p-6">
                  <div className="relative w-full">
                    <div className="flex justify-center items-center h-1 absolute w-full">
                      {loadingModal && (
                        <Lottie
                          config={{
                            animationData: animationData,
                            loop: true,
                            autoplay: true,
                          }}
                          height={100}
                          width={120}
                        />
                      )}

                      {successModal && (
                        <h5 className="text-center text-green-500 auth_error_success mt-3 text-success d-flex justify-content-center align-items-center">
                          <CheckCircleFilled
                            style={{
                              fontSize: '22px',
                              color: '#50C878',
                              marginRight: '5px',
                              position: 'relative',
                              top: '-3px',
                            }}
                          />
                          {successModal}
                        </h5>
                      )}
                      {errorModal && (
                        <h5 className="text-center text-red-400 auth_error_success my-3 text-danger d-flex justify-content-center align-items-center">
                          <ExclamationCircleOutlined
                            style={{
                              fontSize: '20px',
                              color: '#FAA0A0',
                              marginRight: '5px',
                              position: 'relative',
                              top: '-3px',
                            }}
                          />{' '}
                          {errorModal}
                        </h5>
                      )}
                    </div>
                  </div>

                  <form className="m-5" onSubmit={updateCategories}>
                    <div className="mb-4">
                      <label className="text-slate-600">Categories</label>
                      <Select
                        name="select"
                        options={data}
                        labelField="name"
                        valueField="_id"
                        multi
                        onChange={(value) => setCategories(value)}
                        color="#5ac8fa"
                        className="mt-2"
                      />
                    </div>

                    <div className="flex justify-start mt-10">
                      <button
                        className={`bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded mr-10 px-10 ${
                          loadingModal && 'ActionButton'
                        }`}
                        type="submit"
                      >
                        Update
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          user?.google ? logoutGoogle() : logout()
                        }}
                        className=" text-sky-500 font-bold py-2 px-10 rounded border-sky-500 border"
                        disabled={loadingModal}
                      >
                        Logout
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/trainer/:username" element={<PublicProfile />} />

          <Route
            exact
            path="/trainer/:username/:id/:date"
            element={<ScheduleDetails />}
          />

          <Route element={<NotLoggedInRoute />}>
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/login" element={<Login />} />
            <Route
              path="/complete-registration/:token"
              element={<TokenHandler />}
            />
          </Route>

          <Route element={<UserRoute />}>
            <Route exact path="/dashboard" element={<Dashboard />} />
            <Route exact path="/settings" element={<Settings />} />
            <Route exact path="/schedule-client" element={<ClientSchedule />} />
            <Route exact path="/checkout" element={<Checkout />} />
          </Route>

          <Route element={<TrainerRoute />}>
            <Route exact path="/clients" element={<Clients />} />
            <Route exact path="/clients/add-client" element={<AddClient />} />
            <Route exact path="/schedule" element={<Schedule />} />
            <Route
              exact
              path="/dashboard/next-payment-trainer"
              element={<NextPayment />}
            />
          </Route>

          <Route element={<AdminRoute />}>
            <Route exact path="/admin/dashboard" element={<AdminDashboard />} />
            <Route
              exact
              path="/admin/categories"
              element={<AdminCategories />}
            />
            <Route
              exact
              path="/admin/price-list"
              element={<AdminPriceList />}
            />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </div>
  )
}

export default App
