import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useNavigate } from 'react-router-dom'
import { BsEnvelope, BsPhone, BsPlayBtn } from 'react-icons/bs'
import Cookies from 'js-cookie'
import {
  CheckCircleFilled,
  ExclamationCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import { useStateContext } from '../../../components/contexts/ContextProvider'
import UserSidebar from '../../../components/sidebar/UserSidebar'
import Navbar from '../../../components/nav/Navbar'
import HeaderProfile from '../../../components/HeaderProfile'
import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { AiOutlineUser } from 'react-icons/ai'
import { BiUserCheck } from 'react-icons/bi'
import { RiLockPasswordLine } from 'react-icons/ri'
import {
  updateUserData,
  updateUserPassword,
} from '../../../components/functions/user'
import { Lottie } from '@crello/react-lottie'
import animationData from '../../../assets/loader.json'
import { toast } from 'react-toastify'
import WebNavBar from '../../../components/nav/WebNavBar'
import Footer from '../../../components/footer/Footer'
import { BarLoader } from 'react-spinners'
import Select from 'react-dropdown-select'
import {
  MdDateRange,
  MdOutlineEvent,
  MdOutlinePayment,
  MdSportsGymnastics,
} from 'react-icons/md'
import {
  getScheduleTrainer,
  registerFrontClient,
} from '../../../components/functions/client'

const AddClient = () => {
  const user = useSelector((state) => state.user)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const { activeMenu } = useStateContext()
  const [openTab, setOpenTab] = useState(1)
  const [scheduleValues, setScheduleValues] = useState([])
  const [schedules, setSchedules] = useState([])
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const getSchedule = async () => {
    try {
      setLoading(true)
      const res = await getScheduleTrainer(user?.token, setError)
      if (res.status === 200) {
        setSchedules(res?.data?.trainerData)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSchedule()
  }, [])

  const onSubmit = async (formData) => {
    const { email, name, nextPayment, phone, startDate, traineeFocus } =
      formData

    if (!scheduleValues) {
      return toast.error('Schedule required')
    }

    const sendData = {
      email,
      schedules: scheduleValues.map((item) => item._id),
      name,
      nextPayment,
      phone,
      startDate,
      traineeFocus,
      trainer: user?.id,
    }

    setError('')
    setSuccess('')
    try {
      setLoading(true)
      const response = await registerFrontClient(
        sendData,
        user?.token,
        setError
      )
      setSuccess(response.data.message)
      setTimeout(() => {
        setSuccess('')
        setError('')
        reset()
        navigate('/clients')
      }, 2000)

      setLoading(false)
    } catch (err) {
      setLoading(false)
      setSuccess('')
    }
  }

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

          <div className="m-2 md:ml-12">
            <h1 className="text-xl mb-4">Add new client</h1>

            <div className="m-4 md:ml-0 mt-2 p-0 md:p-0 bg-white">
              <div className="relative w-full">
                <div className="flex justify-center items-center h-1 absolute w-full">
                  {loading && (
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

                  {success && (
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
                      {success}
                    </h5>
                  )}
                  {error && (
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
                      {error}
                    </h5>
                  )}
                </div>
              </div>

              <div className="-mx-4 sm:-mx-8 sm:px-8 py-4 overflow-x-auto">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="mb-4">
                    <label className="text-slate-600">Client name</label>
                    <div className="w-full inline-flex bg-stone-100 mt-1">
                      <div className="w-1/12 flex justify-center items-center border-r border-red-50">
                        <AiOutlineUser size={25} />
                      </div>
                      <input
                        id="name"
                        type="text"
                        {...register('name', { required: 'Name is required' })}
                        className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200 outline-none"
                        placeholder="Your name"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="text-slate-600">Client email</label>
                    <div className="w-full inline-flex bg-stone-100 mt-1">
                      <div className="w-1/12 flex justify-center items-center border-r border-red-50">
                        <BsEnvelope size={25} />
                      </div>
                      <input
                        id="email"
                        type="text"
                        {...register('email', {
                          required: 'Email is required',
                        })}
                        className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200 outline-none"
                        placeholder="Your email"
                      />
                    </div>
                    {errors.email && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="text-slate-600">Client phone</label>
                    <div className="w-full inline-flex bg-stone-100 mt-1">
                      <div className="w-1/12 flex justify-center items-center border-r border-red-50">
                        <BsPhone size={25} />
                      </div>
                      <input
                        id="phone"
                        type="text"
                        {...register('phone', {
                          required: 'Phone is required',
                        })}
                        className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200 outline-none"
                        placeholder="Your phone"
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="text-slate-600">Start date</label>
                    <div className="w-full inline-flex bg-stone-100 mt-1">
                      <div className="w-1/12 flex justify-center items-center border-r border-red-50">
                        <MdDateRange size={25} />
                      </div>
                      <input
                        id="startDate"
                        type="date"
                        {...register('startDate', {
                          required: 'Start Date is required',
                        })}
                        className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200 outline-none"
                        placeholder="Start Date"
                      />
                    </div>
                    {errors.startDate && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.startDate.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="text-slate-600">Trainee focus</label>
                    <div className="w-full inline-flex bg-stone-100 mt-1">
                      <div className="w-1/12 flex justify-center items-center border-r border-red-50">
                        <MdSportsGymnastics size={25} />
                      </div>
                      <input
                        id="traineeFocus"
                        type="text"
                        {...register('traineeFocus', {
                          required: 'Trainee Focus is required',
                        })}
                        className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200 outline-none"
                        placeholder="Trainee Focus"
                      />
                    </div>
                    {errors.traineeFocus && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.traineeFocus.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="text-slate-600">Next payment date</label>
                    <div className="w-full inline-flex bg-stone-100 mt-1">
                      <div className="w-1/12 flex justify-center items-center border-r border-red-50">
                        <MdOutlinePayment size={25} />
                      </div>
                      <input
                        id="nextPayment"
                        type="date"
                        {...register('nextPayment', {
                          required: 'Next Payment is required',
                        })}
                        className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200 outline-none"
                        placeholder="Next Payment"
                      />
                    </div>
                    {errors.nextPayment && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.nextPayment.message}
                      </p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label className="text-slate-600">Schedules</label>
                    <Select
                      name="select"
                      options={schedules}
                      labelField="title"
                      valueField="_id"
                      multi
                      onChange={(value) => setScheduleValues(value)}
                      color="#5ac8fa"
                    />
                  </div>

                  <div className="px-2 pb-2 pt-2">
                    <button className="uppercase block w-full p-2 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none text-white">
                      Add client
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default AddClient
