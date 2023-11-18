import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { BsEnvelope, BsPlayBtn } from 'react-icons/bs'
import Cookies from 'js-cookie'
import {
  CheckCircleFilled,
  ExclamationCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
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
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'
import { isSameDay } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import {
  deleteSchedule,
  getScheduleClientsFront,
  getScheduleTrainer,
  sendScheduleData,
  updateSchedule,
} from '../../../components/functions/client'
const cancelIcon = require('../../../assets/cancel-icon.png')

const locales = {
  'en-US': require('date-fns/locale/en-US'),
}

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

const ClientSchedule = () => {
  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    control: controlEdit,
    setValue,
    watch,
    reset,
  } = useForm()

  const virtual = watch('isVirtual')
  const virtualLnk = watch('virtualMeetingLink')

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [successModal, setSuccessModal] = useState('')
  const [errorModal, setErrorModal] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)

  const { activeMenu } = useStateContext()
  const [openTab, setOpenTab] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [scheduleTitle, setScheduleTitle] = useState('')
  const [dbError, setDbError] = useState(false)
  const [schedules, setSchedules] = useState([])
  const [selectedScheduleEdit, setSelectedScheduleEdit] = useState(null)

  const getSchedule = async () => {
    try {
      setLoading(true)
      const res = await getScheduleClientsFront(user?.token, setError)
      if (res.status === 200) {
        const modifiedData = res?.data?.clientData.map((item) => {
          return {
            ...item,
            start: new Date(item.start),
            end: new Date(item.end),
          }
        })
        setSchedules(modifiedData)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSchedule()
  }, [])

  const scheduleSelect = (event) => {
    const shFound = schedules?.find((sh) => sh._id === event._id)
    setSelectedScheduleEdit(shFound)
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setSelectedScheduleEdit(null)
    setErrorModal('')
    setSuccessModal('')
    setShowEditModal(false)
    reset()
  }

  useEffect(() => {
    if (selectedScheduleEdit) {
      setValue('title', selectedScheduleEdit.title)
      setValue('describe', selectedScheduleEdit.description)

      const { start, end } = selectedScheduleEdit

      const formattedStart = moment(start).toDate()
      const formattedEnd = moment(end).toDate()

      setValue('isVirtual', selectedScheduleEdit?.isVirtual)
      setValue('virtualMeetingLink', selectedScheduleEdit?.virtualMeetingLink)
      setValue('start', formattedStart)
      setValue('end', formattedEnd)
    }
  }, [selectedScheduleEdit, setValue])

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
            <h1 className="text-xl mb-4">Schedule</h1>

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
                {showEditModal && (
                  <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-1/2 pb-2">
                      <div className="bg-gray-100 border-b px-4 py-6 flex justify-between items-center rounded-lg">
                        <h3 className="font-semibold text-xl text-stone-600">
                          Schedule details
                        </h3>

                        <div className="flex">
                          <button
                            onClick={closeEditModal}
                            className="text-black close-modal"
                          >
                            <img src={cancelIcon} alt="Cancel" />
                          </button>
                        </div>
                      </div>

                      <div className="p-6">
                        <form className="m-5">
                          <div className="mb-4">
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700 my-2"
                            >
                              Schedule name / title
                            </label>
                            <input
                              id="title"
                              type="text"
                              {...registerEdit('title', {
                                required: 'Title is required',
                              })}
                              className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                              placeholder="Schedule title"
                              disabled
                            />
                            {errorsEdit.title && (
                              <p className="text-red-500 text-xs mt-1">
                                {errorsEdit.title.message}
                              </p>
                            )}
                          </div>
                          <div className="mb-4 z-10">
                            <label
                              htmlFor="start"
                              className="block text-sm font-medium text-gray-700 my-2"
                            >
                              Selected start date
                            </label>
                            <Controller
                              control={controlEdit}
                              name="start"
                              className="w-full"
                              render={({ field }) => (
                                <DatePicker
                                  placeholderText="Start start date"
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  value={field.value}
                                  showTimeSelect
                                  timeFormat="HH:mm"
                                  dateFormat="MMMM d, yyyy h:mm aa"
                                  className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                                  id="start"
                                  disabled
                                />
                              )}
                            />
                          </div>
                          <div className="mb-4 z-10">
                            <label
                              htmlFor="end"
                              className="block text-sm font-medium text-gray-700 my-2"
                            >
                              Selected end date
                            </label>
                            <Controller
                              control={controlEdit}
                              name="end"
                              render={({ field }) => (
                                <DatePicker
                                  placeholderText="Select end date"
                                  onChange={(date) => field.onChange(date)}
                                  selected={field.value}
                                  value={field.value}
                                  timeFormat="HH:mm"
                                  dateFormat="MMMM d, yyyy h:mm aa"
                                  showTimeSelect
                                  className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                                  id="end"
                                  disabled
                                />
                              )}
                            />
                          </div>

                          {virtual && (
                            <div className="mb-4">
                              <label className="text-slate-600">
                                Virtual meeting link
                              </label>
                              <br />

                              <a
                                href={`${virtualLnk}`}
                                alt="Link"
                                target="_blank"
                                rel="noreferrer"
                                className="pt-1 inline-block text-sky-600"
                              >
                                {virtualLnk}
                              </a>
                            </div>
                          )}

                          <div className="mb-4">
                            <label
                              htmlFor="describe"
                              className="block text-sm font-medium text-gray-700 my-2"
                            >
                              Schedule Description
                            </label>
                            <input
                              {...registerEdit('describe')}
                              type="text"
                              className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                              id="describe"
                              aria-describedby="describe"
                              disabled
                            />
                          </div>
                          <div className="flex justify-start mt-10">
                            <button
                              type="button"
                              onClick={closeEditModal}
                              className=" text-sky-500 font-bold py-2 px-10 rounded border-sky-500 border"
                              disabled={loadingModal}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                )}

                <Calendar
                  localizer={localizer}
                  events={schedules}
                  startAccessor="start"
                  endAccessor="end"
                  defaultView="month"
                  style={{
                    height: 600,
                  }}
                  onSelectEvent={scheduleSelect}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}

export default ClientSchedule
