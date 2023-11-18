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
  getScheduleTrainer,
  sendScheduleData,
  updateSchedule,
} from '../../../components/functions/client'
import Select from 'react-dropdown-select'
import { getPricing } from '../../../components/functions/pricing'
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

const Schedule = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    reset,
    watch,
  } = useForm()

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    control: controlEdit,
    setValue,
    watch: watchEditModal,
    reset: resetEdit,
  } = useForm()

  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [successModal, setSuccessModal] = useState('')
  const [errorModal, setErrorModal] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)
  const [data, setData] = useState([])
  const [pricingValues, setPricingValues] = useState([])
  const { activeMenu } = useStateContext()
  const [openTab, setOpenTab] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [scheduleTitle, setScheduleTitle] = useState('')
  const [dbError, setDbError] = useState(false)
  const [schedules, setSchedules] = useState([])
  const [selectedScheduleEdit, setSelectedScheduleEdit] = useState(null)
  const [selectedPricing, setSelectedPricing] = useState([])
  const [selectedCategory, setSelectedCategory] = useState([])
  const [selectedCat, setSelectedCat] = useState({})
  const [categories, setCategories] = useState([])

  const virtual = watch('isVirtual')
  const virtualEdit = watchEditModal('isVirtual')
  const virtualLnk = watchEditModal('virtualMeetingLink')

  const getSchedule = async () => {
    try {
      setLoading(true)
      const res = await getScheduleTrainer(user?.token, setError)
      if (res.status === 200) {
        const modifiedData = res?.data?.trainerData.map((item) => {
          return {
            ...item,
            start: new Date(item.start),
            end: new Date(item.end),
          }
        })
        setSchedules(modifiedData)
        setCategories(res?.data?.user?.categories)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getSchedule()
  }, [])

  const getData = async () => {
    try {
      setLoading(true)
      const res = await getPricing(setError)
      if (res.status === 200) {
        setData(res?.data?.pricing)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const processedData = data.map((item) => ({
    ...item,
    label: `${item.title} - $${item.price}`,
  }))

  const scheduleSelect = (event) => {
    const shFound = schedules?.find((sh) => sh._id === event._id)
    setSelectedScheduleEdit(shFound)

    const catFound = categories?.find(
      (cat) => cat?._id === (shFound?.category?._id || shFound?.category)
    )

    setSelectedCategory(catFound ? [catFound] : [])
    setSelectedCat(catFound)

    const pricingIds = shFound?.pricing || []

    const pricingFound = processedData.filter((pr) =>
      pricingIds.some((pricing) => pricing._id === pr._id)
    )

    setSelectedPricing(pricingFound)
    setPricingValues(pricingFound)
    setShowEditModal(true)
  }

  const closeModal = () => {
    setSelectedSlot(null)
    setErrorModal('')
    setSuccessModal('')
    setPricingValues([])
    setSelectedCat({})
    setShowModal(false)
  }

  const closeEditModal = () => {
    setSelectedScheduleEdit(null)
    setErrorModal('')
    setSuccessModal('')
    setPricingValues([])
    setSelectedCat({})
    setShowEditModal(false)
    resetEdit()
  }

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo)
    setShowModal(true)
  }

  useEffect(() => {
    if (selectedScheduleEdit) {
      setValue('title', selectedScheduleEdit?.title)
      setValue('describe', selectedScheduleEdit?.description)

      const { start, end } = selectedScheduleEdit

      const formattedStart = moment(start).toDate()
      const formattedEnd = moment(end).toDate()

      setValue('start', formattedStart)
      setValue('end', formattedEnd)
      setValue('isVirtual', selectedScheduleEdit?.isVirtual.toString())
      setValue('virtualMeetingLink', selectedScheduleEdit?.virtualMeetingLink)
      setValue('location', selectedScheduleEdit?.location)
    }
  }, [selectedScheduleEdit, setValue])

  const onSubmit = async (formData) => {
    const currentDate = new Date()
    const selectedStartDate = new Date(selectedSlot?.slots[0])

    if (virtual === 'Yes' && !formData?.virtualMeetingLink) {
      return toast.error('Schedule virtual meeting link is required!')
    }

    setErrorModal('')
    setSuccessModal('')

    try {
      setLoadingModal(true)
      if (formData.start && formData.end) {
        const newSchedule = {
          trainer: user?.id,
          title: formData.title,
          allDay: selectedSlot.slots.length === 1,
          start: formData.start,
          end: formData.end,
          isVirtual: virtual === 'Yes' ? true : false,
          virtualMeetingLink: formData?.virtualMeetingLink,
          description: formData?.describe ? formData?.describe : '',
          location: formData.location,
          pricing: pricingValues,
          category: selectedCat?._id,
        }

        const res = await sendScheduleData(
          newSchedule,
          user?.token,
          setErrorModal
        )

        if (res.status === 200) {
          setSuccessModal('Schedule added successfully')
          setTimeout(() => {
            setSuccessModal('')
            setErrorModal('')
            reset()
            getSchedule()
            closeModal()
          }, 2000)
        }

        setLoadingModal(false)
      } else {
        setErrorModal('Please select both start and end dates')
      }
    } catch (error) {
      setLoadingModal(false)
    }
  }

  const onSubmitEdit = async (formData) => {
    const isAllDay = isSameDay(new Date(formData.start), new Date(formData.end))
    try {
      setErrorModal('')
      setSuccessModal('')
      setLoadingModal(true)
      const newSchedule = {
        title: formData.title,
        allDay: isAllDay,
        start: formData.start,
        end: formData.end,
        isVirtual: virtualEdit === 'true' ? true : false,
        virtualMeetingLink: virtualEdit === 'true' ? virtualLnk : null,
        description: formData?.describe ? formData?.describe : '',
        location: formData.location,
        pricing: pricingValues,
        category: selectedCat?._id,
      }

      const res = await updateSchedule(
        selectedScheduleEdit?._id,
        newSchedule,
        user?.token,
        setErrorModal
      )

      if (res.status === 200) {
        setSuccessModal(res.data.message)
        setTimeout(() => {
          setSuccessModal('')
          setErrorModal('')
          getSchedule()
          closeEditModal()
        }, 2000)
      }

      setLoadingModal(false)
    } catch (error) {
      setLoadingModal(false)
    }
  }

  const deleteScheduleById = async (title, delId) => {
    setErrorModal('')
    setSuccessModal('')
    if (window.confirm('Are you sure you want to delete?')) {
      setLoadingModal(true)
      try {
        const res = await deleteSchedule(delId, user?.token, setErrorModal)
        if (res.status === 200) {
          setErrorModal('')
          setSuccessModal(`"${title}" is deleted`)

          setTimeout(() => {
            setSuccessModal('')
            setSelectedScheduleEdit(null)
            getSchedule()
            closeEditModal()
          }, 2000)

          getSchedule()
        }
        setLoadingModal(false)
      } catch (error) {
        setLoadingModal(false)
      }
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
            <h1 className="text-xl mb-4">Schedule</h1>
            <button
              onClick={() => setShowModal(!showModal)}
              className="border-x-1 border-y-1 hover:bg-sky-400  py-2 px-4 sm:mb-0 bg-sky-500 text-white"
            >
              Add Schedule
            </button>

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
                {showModal && (
                  <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-1/2 pb-2 overflow-y-auto max-h-[100vh]">
                      <div className="bg-gray-100 border-b px-4 py-6 flex justify-between items-center rounded-lg">
                        <h3 className="font-semibold text-xl text-stone-600">
                          Add schedule
                        </h3>

                        <div className="flex">
                          <button
                            onClick={closeModal}
                            className="text-black close-modal"
                          >
                            <img src={cancelIcon} alt="Cancel" />
                          </button>
                        </div>
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

                        <form onSubmit={handleSubmit(onSubmit)} className="m-5">
                          <div className="mb-4">
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700 my-2"
                            >
                              Schedule title
                            </label>
                            <input
                              id="title"
                              type="text"
                              {...register('title', {
                                required: 'Title is required',
                              })}
                              className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                              placeholder="Schedule title"
                            />
                            {errors.title && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.title.message}
                              </p>
                            )}
                          </div>

                          <div className="mb-4 z-10">
                            <label
                              htmlFor="start"
                              className="block text-sm font-medium text-gray-700 my-2"
                            >
                              Select start date
                            </label>
                            <Controller
                              control={control}
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
                                />
                              )}
                            />
                          </div>
                          <div className="mb-4 z-10">
                            <label
                              htmlFor="end"
                              className="block text-sm font-medium text-gray-700 my-2"
                            >
                              Select end date
                            </label>
                            <Controller
                              control={control}
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
                                />
                              )}
                            />
                          </div>

                          <div className="mb-4">
                            <label className="text-slate-600">
                              Is this schedule virtual?
                            </label>
                            <div className="flex items-center mt-1">
                              <label htmlFor="isVirtualYes" className="mr-4">
                                <input
                                  {...register('isVirtual')}
                                  type="radio"
                                  value="Yes"
                                  id="isVirtualYes"
                                  className="mr-2"
                                />
                                Yes
                              </label>
                              <label htmlFor="isVirtualNo">
                                <input
                                  {...register('isVirtual')}
                                  type="radio"
                                  value="No"
                                  id="isVirtualNo"
                                  className="mr-2"
                                  defaultChecked
                                />
                                No
                              </label>
                            </div>
                          </div>

                          {virtual === 'Yes' && (
                            <div className="mb-4">
                              <label className="text-slate-600">
                                Virtual Meeting Link
                              </label>
                              <div className="w-full inline-flex bg-stone-100 mt-1">
                                <div className="w-1/12 flex justify-center items-center border-r border-red-50">
                                  <LinkOutlined size={25} />
                                </div>
                                <input
                                  id="virtualMeetingLink"
                                  type="text"
                                  {...register('virtualMeetingLink')}
                                  className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200 outline-none"
                                  placeholder="Virtual Meeting Link"
                                />
                              </div>
                            </div>
                          )}

                          <div className="mb-4">
                            <label
                              htmlFor="describe"
                              className="block text-sm font-medium text-gray-700 my-2"
                            >
                              Schedule Description
                              <span className="text-red-500 text-xs pl-1">
                                (optional)
                              </span>
                            </label>
                            <input
                              {...register('describe')}
                              type="text"
                              placeholder="Describe your schedule"
                              className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                              id="describe"
                              aria-describedby="describe"
                            />
                          </div>

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
                              {...register('location', {
                                required: 'Location is required',
                              })}
                              className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                              placeholder="Location"
                            />
                            {errors.location && (
                              <p className="text-red-500 text-xs mt-1">
                                {errors.location.message}
                              </p>
                            )}
                          </div>

                          <div className="mb-4">
                            <label className="text-slate-600">Category</label>
                            <Select
                              name="selectCat"
                              options={categories}
                              labelField="name"
                              valueField="_id"
                              onChange={(value) => setSelectedCat(value[0])}
                              color="#5ac8fa"
                              className="mt-1"
                            />
                          </div>

                          <div className="mb-4">
                            <label className="text-slate-600">Pricing</label>
                            <Select
                              name="select"
                              options={processedData}
                              labelField="label"
                              valueField="_id"
                              multi
                              onChange={(value) => setPricingValues(value)}
                              color="#5ac8fa"
                              className="mt-1"
                            />
                          </div>

                          <div className="flex justify-start mt-10 mb-14">
                            <button
                              className={`bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded mr-10 px-10 ${
                                loadingModal && 'ActionButton'
                              }`}
                              type="submit"
                            >
                              Add schedule
                            </button>
                            <button
                              type="button"
                              onClick={closeModal}
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

                {showEditModal && (
                  <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
                    <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-1/2 pb-2 overflow-y-auto max-h-[100vh]">
                      <div className="bg-gray-100 border-b px-4 py-6 flex justify-between items-center rounded-lg">
                        <h3 className="font-semibold text-xl text-stone-600">
                          Update or delete schedule
                        </h3>

                        <div className="flex">
                          <button
                            onClick={() =>
                              deleteScheduleById(
                                selectedScheduleEdit?.title,
                                selectedScheduleEdit?._id
                              )
                            }
                            className={`bg-red-500 hover:bg-red-400 text-white font-bold py-2 rounded mr-10 px-10 ${
                              loadingModal && 'ActionButton'
                            }`}
                            type="button"
                          >
                            Delete
                          </button>
                          <button
                            onClick={closeEditModal}
                            className="text-black close-modal"
                          >
                            <img src={cancelIcon} alt="Cancel" />
                          </button>
                        </div>
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

                        <form
                          onSubmit={handleSubmitEdit(onSubmitEdit)}
                          className="m-5"
                        >
                          <div className="mb-4">
                            <label
                              htmlFor="title"
                              className="block text-sm font-medium text-gray-700 my-2"
                            >
                              Schedule title
                            </label>
                            <input
                              id="title"
                              type="text"
                              {...registerEdit('title', {
                                required: 'Title is required',
                              })}
                              className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                              placeholder="Schedule title"
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
                              Select start date
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
                                />
                              )}
                            />
                          </div>
                          <div className="mb-4 z-10">
                            <label
                              htmlFor="end"
                              className="block text-sm font-medium text-gray-700 my-2"
                            >
                              Select end date
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
                                />
                              )}
                            />
                          </div>

                          <div className="mb-4">
                            <label className="text-slate-600">
                              Is this schedule virtual?
                            </label>
                            <div className="flex items-center mt-1">
                              <label htmlFor="isVirtualYes" className="mr-4">
                                <input
                                  {...registerEdit('isVirtual')}
                                  type="radio"
                                  value={true}
                                  id="isVirtualYes"
                                  className="mr-2"
                                  defaultChecked={virtualEdit === 'true'}
                                />
                                Yes
                              </label>
                              <label htmlFor="isVirtualNo">
                                <input
                                  {...registerEdit('isVirtual')}
                                  type="radio"
                                  value={false}
                                  id="isVirtualNo"
                                  className="mr-2"
                                  defaultChecked={virtualEdit === 'false'}
                                />
                                No
                              </label>
                            </div>
                          </div>

                          {virtualEdit === 'true' && (
                            <div className="mb-4">
                              <label className="text-slate-600">
                                Virtual Meeting Link
                              </label>
                              <div className="w-full inline-flex bg-stone-100 mt-1">
                                <div className="w-1/12 flex justify-center items-center border-r border-red-50">
                                  <LinkOutlined size={25} />
                                </div>
                                <input
                                  id="virtualMeetingLink"
                                  type="text"
                                  {...registerEdit('virtualMeetingLink')}
                                  className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200 outline-none"
                                  placeholder="Virtual Meeting Link"
                                />
                              </div>
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
                              <span className="text-red-500 text-xs pl-1">
                                (optional)
                              </span>
                            </label>
                            <input
                              {...registerEdit('describe')}
                              type="text"
                              placeholder="Describe your schedule"
                              className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                              id="describe"
                              aria-describedby="describe"
                            />
                          </div>

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
                              className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                              placeholder="Location"
                            />
                            {errorsEdit.location && (
                              <p className="text-red-500 text-xs mt-1">
                                {errorsEdit.location.message}
                              </p>
                            )}
                          </div>

                          <div className="mb-4">
                            <label className="text-slate-600">Category</label>
                            <Select
                              name="selectCat"
                              options={categories}
                              labelField="name"
                              valueField="_id"
                              onChange={(value) => setSelectedCat(value[0])}
                              color="#5ac8fa"
                              className="mt-1"
                              values={selectedCategory}
                            />
                          </div>

                          <div className="mb-4">
                            <label className="text-slate-600">Pricing</label>
                            <Select
                              name="select"
                              options={processedData}
                              labelField="label"
                              valueField="_id"
                              multi
                              onChange={(value) => setPricingValues(value)}
                              color="#5ac8fa"
                              className="mt-1"
                              values={selectedPricing}
                            />
                          </div>

                          <div className="flex justify-start mt-10">
                            <button
                              className={`bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded mr-10 px-10 ${
                                loadingModal && 'ActionButton'
                              }`}
                              type="submit"
                            >
                              Update schedule
                            </button>

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
                  selectable
                  onSelectSlot={handleSelectSlot}
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

export default Schedule
