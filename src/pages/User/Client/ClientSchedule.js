import { useDispatch, useSelector } from 'react-redux'

import { CheckCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useStateContext } from '../../../components/contexts/ContextProvider'
import UserSidebar from '../../../components/sidebar/UserSidebar'
import Navbar from '../../../components/nav/Navbar'

import { useEffect, useRef, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'

import { Lottie } from '@crello/react-lottie'
import animationData from '../../../assets/loader.json'

import WebNavBar from '../../../components/nav/WebNavBar'
import Footer from '../../../components/footer/Footer'

import { Calendar, dateFnsLocalizer } from 'react-big-calendar'
import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import moment from 'moment'
import { getScheduleClientsFront } from '../../../components/functions/client'
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
  const divRef = useRef()
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
  const [timeSlots, setTimeSlots] = useState([
    { start: new Date(), end: new Date() },
  ])

  const { activeMenu } = useStateContext()

  const [showEditModal, setShowEditModal] = useState(false)

  const [schedules, setSchedules] = useState([])
  const [selectedScheduleEdit, setSelectedScheduleEdit] = useState(null)

  const getSchedule = async () => {
    try {
      setLoading(true)
      const res = await getScheduleClientsFront(user?.token, setError)
      if (res.status === 200) {
        const modifiedData = res?.data?.clientData.map((item) => {
          const processedItem = {
            ...item,
            start: new Date(item.start),
            end: new Date(item.end),
          }

          if (item.timeSlots && Array.isArray(item.timeSlots)) {
            processedItem.timeSlots = item.timeSlots.map((slot) => ({
              start: new Date(slot.start),
              end: new Date(slot.end),
            }))
          } else {
            processedItem.timeSlots = []
          }

          return processedItem
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
    const shFound = schedules?.find((sh) => sh._id === event.id)
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
      setValue('isVirtual', selectedScheduleEdit?.isVirtual)
      setValue('virtualMeetingLink', selectedScheduleEdit?.virtualMeetingLink)
      setValue('location', selectedScheduleEdit.location)

      const timeSlots = selectedScheduleEdit?.timeSlots || []

      const formattedTimeSlots = timeSlots.map((slot) => ({
        start: new Date(slot.start),
        end: new Date(slot.end),
      }))

      setTimeSlots(formattedTimeSlots)
    }
  }, [selectedScheduleEdit, setValue, setTimeSlots])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeEditModal()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        closeEditModal()
      }
    }

    window.addEventListener('mouseup', handleClickOutside)

    return () => {
      window.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])

  const allEvents =
    schedules &&
    schedules.reduce((events, item) => {
      events.push({
        id: item._id,
        title: `${item.title} - ${moment(item.start).format('LT')} to ${moment(
          item.end
        ).format('LT')}`,
        start: new Date(item.start),
        end: new Date(item.end),
        type: 'schedule',
      })

      item.timeSlots.forEach((slot, index) => {
        const slotTitle = `${item.title} - Slot ${index + 1} - ${moment(
          slot.start
        ).format('LT')} to ${moment(slot.end).format('LT')}`
        events.push({
          id: item._id,
          title: slotTitle,
          start: new Date(slot.start),
          end: new Date(slot.end),
          type: 'slot',
          slotId: slot._id,
        })
      })

      return events
    }, [])

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
                    <div
                      ref={divRef}
                      className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-1/2 pb-2"
                    >
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

                          {timeSlots.map((slot, index) => (
                            <div key={index} className="mb-4">
                              <label
                                htmlFor={`startEdit${index}`}
                                className="block text-sm font-medium text-gray-700 my-2"
                              >
                                Start date for Slot {index + 1}
                              </label>
                              <div className="flex items-center">
                                <span className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200 outline-none">
                                  {new Date(slot.start).toLocaleString()}
                                </span>
                              </div>

                              <label
                                htmlFor={`endEdit${index}`}
                                className="block text-sm font-medium text-gray-700 my-2"
                              >
                                End date for Slot {index + 1}
                              </label>
                              <div className="flex items-center">
                                <span className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200 outline-none">
                                  {new Date(slot.end).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          ))}

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
                              htmlFor="location"
                              className="block text-sm font-medium text-gray-700 my-2"
                            >
                              Location
                            </label>
                            <input
                              id="location"
                              type="text"
                              {...registerEdit('location', {
                                required: 'Location is required',
                              })}
                              disabled
                              className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                              placeholder="Location"
                            />
                          </div>

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
                  events={allEvents}
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
