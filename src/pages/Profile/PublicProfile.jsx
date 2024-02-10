import React, { useCallback, useEffect, useRef, useState } from 'react'
import Footer from '../../components/footer/Footer'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import {
  checkUsernameRegister,
  emailRequestForget,
  forgetPasswordCodeCheck,
  forgetPasswordUpdateRequest,
  getTrainerAndSchedule,
  loginUser,
  registerComplete,
  registerUserFrontBook,
} from '../../components/functions/user'
import WebNavBar from '../../components/nav/WebNavBar'
import { Lottie } from '@crello/react-lottie'
import animationData from '../../assets/loader.json'
import moment from 'moment'
import {
  MdArrowBackIos,
  MdArrowBackIosNew,
  MdArrowForwardIos,
} from 'react-icons/md'
import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import { CheckCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons'
import { useForm } from 'react-hook-form'
import { RiLockPasswordLine } from 'react-icons/ri'
import { BiSolidErrorCircle, BiUserCheck } from 'react-icons/bi'
import GoogleAuth from '../Auth/GoogleAuth'
import { toast } from 'react-toastify'
import { AiFillCheckCircle, AiOutlineUser } from 'react-icons/ai'
import { BsEnvelope, BsPhone } from 'react-icons/bs'
import { CiLocationOn } from 'react-icons/ci'
import GoogleAuthBooking from '../Auth/GoogleAuthBooking'
const cancelIcon = require('../../assets/cancel-icon.png')

const codeInputs = Array(6).fill('')
let newInputCodeIndex = 0

const PublicProfile = () => {
  const { username } = useParams()
  const user = useSelector((state) => state.user)
  const divRef = useRef()
  const [data, setData] = useState([])
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'))
  const [selectedDate, setSelectedDate] = useState(moment().startOf('day'))
  const [clickableDates, setClickableDates] = useState([])
  const [openTab, setOpenTab] = useState(1)
  const [showModal, setShowModal] = useState(false)
  const [successModal, setSuccessModal] = useState('')
  const [errorModal, setErrorModal] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)
  const inputCodeRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [stepReg, setStepReg] = useState(1)
  const [otp, setOtp] = useState({ 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' })
  const [nextInputCodeIndex, setNextInputCodeIndex] = useState(0)
  const [redirectLink, setRedirectLink] = useState(null)
  const [usernameAvailable, setUsernameAvailable] = useState(true)
  const [usernameMsg, setUsernameMsg] = useState('')
  const [filteredSchedules, setFilteredSchedules] = useState([])

  const handleChangeCodeText = (e, index) => {
    const { value } = e.target
    const cdvalue = value.replace(/\D/g, '')
    const newOtp = { ...otp }
    newOtp[index] = cdvalue
    setOtp(newOtp)

    const lastInputCodeIndex = codeInputs.length - 1

    if (!cdvalue) newInputCodeIndex = index === 0 ? 0 : index - 1
    else
      newInputCodeIndex =
        index === codeInputs.length - 1 ? lastInputCodeIndex : index + 1

    setNextInputCodeIndex(newInputCodeIndex)
  }

  useEffect(() => {
    inputCodeRef?.current?.focus()
  }, [nextInputCodeIndex])

  const isObjValid = (obj) => {
    return Object.values(obj).every((val) => val.trim())
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()

  const {
    register: registerForget,
    handleSubmit: handleSubmitEmail,
    watch: watchEmail,
    formState: { errors: errorsEmail },
    reset: resetEmail,
  } = useForm()

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    watch: watchPassword,
    reset: resetPassword,
  } = useForm()

  const {
    register: regRegister,
    handleSubmit: regHandleSubmit,
    watch: regWatch,
    reset: regReset,
    formState: { errors: regErrors },
  } = useForm()

  const email = regWatch('email')
  const usernameCheck = regWatch('username')

  const checkUsername = useCallback(async () => {
    try {
      const response = await checkUsernameRegister(
        usernameCheck,
        setUsernameMsg
      )
      if (response.data.message === 'Available') {
        setUsernameAvailable(true)
      } else {
        setUsernameMsg(false)
      }
    } catch (err) {
      setUsernameAvailable(false)
    }
  })

  useEffect(() => {
    if (usernameCheck?.length >= 4) {
      checkUsername()
    } else {
      setUsernameAvailable(true)
    }
  }, [usernameCheck])

  const handleModalOpen = () => {
    setShowModal(!showModal)
  }

  const closeModal = () => {
    setErrorModal('')
    setSuccessModal('')
    reset()
    setRedirectLink('')
    setOpenTab(1)
    setShowModal(false)
  }

  const emailOrUsrForget = watchEmail('identifierUsrOrEmail')

  const onSubmit = async (formData) => {
    const { identifier, password } = formData

    const sendData = {
      identifier,
      password,
    }

    setErrorModal('')
    setSuccessModal('')
    try {
      setLoadingModal(true)
      const response = await loginUser(sendData, setErrorModal)
      setSuccessModal(response.data.message)
      dispatch({ type: 'LOGIN', payload: response?.data?.userData })
      Cookies.set('user', JSON.stringify(response?.data?.userData), {
        expires: 30,
      })
      setTimeout(() => {
        closeModal()

        navigate(
          `/trainer/${username}/${redirectLink}/${selectedDate.format(
            'DD-MM-YYYY'
          )}`
        )
        setRedirectLink(null)
      }, 2000)
      setLoadingModal(false)
    } catch (err) {
      setLoadingModal(false)
      setSuccessModal('')
    }
  }

  const emailSubmit = async (emailData) => {
    const { identifierUsrOrEmail } = emailData

    const sendData = {
      identifierUsrOrEmail,
    }

    setErrorModal('')
    setSuccessModal('')
    try {
      setLoadingModal(true)
      const response = await emailRequestForget(sendData, setErrorModal)
      setSuccess(response.data.message)
      setTimeout(() => {
        setSuccessModal('')
        setErrorModal('')
        setStep(3)
      }, 2000)
      setLoadingModal(false)
    } catch (err) {
      setLoadingModal(false)
      setSuccessModal('')
    }
  }

  const handleVerification = async (e) => {
    e.preventDefault()
    let val = ''
    Object.values(otp).forEach((v) => {
      val += v
    })
    setErrorModal('')
    setSuccessModal('')
    if (val.length < 6) {
      toast.error('Please fill all code fields')
      setLoadingModal(false)
    } else {
      if (isObjValid(otp)) {
        let val = ''
        Object.values(otp).forEach((v) => {
          val += v
        })

        if (!val) {
          alert('Please enter the code')
          setLoadingModal(false)
          return
        }

        let sendData = {
          emailOrUsrForget,
          vcode: val,
        }

        try {
          setLoadingModal(true)
          const response = await forgetPasswordCodeCheck(
            sendData,
            setErrorModal
          )
          setSuccessModal(response.data.message)
          setTimeout(() => {
            setSuccessModal('')
            setErrorModal('')
            setStep(4)
          }, 2000)
          setLoadingModal(false)
        } catch (err) {
          setLoadingModal(false)
          setSuccessModal('')
        }
      }
    }
  }

  const handleUpdatePassword = async (passwordData) => {
    const { newPassword, confirmPassword } = passwordData

    if (newPassword !== confirmPassword) {
      toast.error('Password does not match')
      return
    }

    let val = ''
    Object.values(otp).forEach((v) => {
      val += v
    })
    if (val.length < 6) {
      toast.error('Please fill all code fields')
      setLoadingModal(false)
    } else {
      if (isObjValid(otp)) {
        let val = ''
        Object.values(otp).forEach((v) => {
          val += v
        })

        if (!val) {
          alert('Please enter the code')
          setLoadingModal(false)
          return
        }

        let sendData = {
          emailOrUsrForget,
          password: newPassword,
          vcode: val,
        }

        setErrorModal('')
        setSuccessModal('')
        try {
          setLoadingModal(true)
          const response = await forgetPasswordUpdateRequest(
            sendData,
            setErrorModal
          )
          setSuccessModal(response.data.message)
          setTimeout(() => {
            setSuccessModal('')
            setErrorModal('')
            reset()
            resetEmail()
            resetPassword()
            setOtp({ 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' })
            setStep(1)
          }, 2000)
          setLoadingModal(false)
        } catch (err) {
          setLoadingModal(false)
          setSuccessModal('')
        }
      }
    }
  }

  const onSubmitRegister = async (formData) => {
    const { name, email, phone, password, username, confirmPassword } = formData

    if (password !== confirmPassword) {
      toast.error('Password does not match')
      return
    }

    const sendData = {
      name,
      email,
      phone,
      password,
      schedules: redirectLink,
      username,
      trainer: data?._id,
    }

    setErrorModal('')
    setSuccessModal('')
    try {
      setLoadingModal(true)
      const response = await registerUserFrontBook(sendData, setErrorModal)
      setSuccessModal(response.data.message)
      setTimeout(() => {
        setSuccessModal('')
        setErrorModal('')
        setStepReg(2)
      }, 2000)
      setLoadingModal(false)
    } catch (err) {
      setLoadingModal(false)
      setSuccessModal('')
    }
  }

  const handleCompleteRegistration = async () => {
    let val = ''
    Object.values(otp).forEach((v) => {
      val += v
    })

    setLoadingModal(true)
    if (val.length < 6) {
      toast.error('Please fill all code fields')
      setErrorModal('')
      setSuccessModal('')
      setLoadingModal(false)
    } else {
      if (isObjValid(otp)) {
        let val = ''
        Object.values(otp).forEach((v) => {
          val += v
        })

        if (!val) {
          alert('Please enter the code')
          setLoadingModal(false)
          return
        }

        const sendData = {
          email,
          vcode: val,
        }

        setErrorModal('')
        setSuccessModal('')
        try {
          const response = await registerComplete(sendData, setErrorModal)
          setSuccessModal(response.data.message)

          dispatch({ type: 'LOGIN', payload: response?.data?.userData })
          Cookies.set('user', JSON.stringify(response?.data?.userData), {
            expires: 30,
          })
          setTimeout(() => {
            closeModal()
            setOtp({ 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' })
            navigate(
              `/trainer/${username}/${redirectLink}/${selectedDate.format(
                'DD-MM-YYYY'
              )}`
            )
            setRedirectLink(null)
          }, 2000)
          setLoadingModal(false)
        } catch (err) {
          setLoadingModal(false)
          setSuccessModal('')
        }
      }
    }
  }

  const weeksToShow = 3

  const getTrainer = async () => {
    try {
      setLoading(true)
      const res = await getTrainerAndSchedule(username, setError)
      if (res && res.status === 200) {
        setData(res.data.user)
        setSchedules(res.data.schedules)

        const scheduleDates = res.data.schedules.flatMap((schedule) => {
          return schedule.timeSlots.flatMap((timeSlot) => {
            const startDate = moment(timeSlot.start)
            const endDate = moment(timeSlot.end)
            const datesInRange = []

            for (
              let currentDate = startDate.clone();
              currentDate.isSameOrBefore(endDate, 'day');
              currentDate.add(1, 'day')
            ) {
              datesInRange.push(currentDate.format('YYYY-MM-DD'))
            }

            return datesInRange
          })
        })

        setClickableDates(scheduleDates)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTrainer()
  }, [])

  const handleDateChange = (direction) => {
    setScheduleLoading(true)

    setCurrentWeek((prevWeek) =>
      direction === 'next'
        ? moment(prevWeek).add(1, 'weeks')
        : moment(prevWeek).subtract(1, 'weeks')
    )

    const newSelectedDate =
      direction === 'next'
        ? moment(currentWeek).add(1, 'weeks').startOf('week').startOf('day')
        : moment(currentWeek)
            .subtract(1, 'weeks')
            .startOf('week')
            .startOf('day')

    if (newSelectedDate.isAfter(moment().startOf('day'))) {
      setSelectedDate(newSelectedDate)
    } else {
      setSelectedDate(moment().startOf('day'))
    }

    setTimeout(() => {
      setScheduleLoading(false)
    }, 2000)
  }

  const handleDateClick = (date) => {
    if (date.isSameOrAfter(moment().startOf('day'))) {
      setScheduleLoading(true)
      setSelectedDate(date.startOf('day'))

      setTimeout(() => {
        setScheduleLoading(false)
      }, 2000)
    }
  }

  const isDateInAnyTimeSlot = (date) => {
    return schedules.some((schedule) =>
      schedule.timeSlots.some((timeSlot) => {
        const startDate = moment(timeSlot.start).startOf('day')
        const endDate = moment(timeSlot.end).startOf('day')
        return date.isBetween(startDate, endDate, null, '[]')
      })
    )
  }

  const renderDateColumns = () => {
    const dateColumns = []

    for (let i = 0; i < 7; i++) {
      const currentDate = moment(currentWeek).startOf('week').add(i, 'days')
      const isToday = currentDate.isSame(moment().startOf('day'), 'day')
      const isSelected = selectedDate.isSame(currentDate, 'day')
      const isPastDate = currentDate.isBefore(moment().startOf('day'), 'day')
      const isDateAvailable = isDateInAnyTimeSlot(currentDate)

      dateColumns.push(
        <div
          key={i}
          className={`text-center ${
            isSelected
              ? 'font-bold text-sky-500'
              : isToday
              ? 'text-blue-600'
              : isPastDate
              ? 'text-gray-400 cursor-not-allowed'
              : isDateAvailable
              ? 'text-black cursor-pointer'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          onClick={() =>
            isDateAvailable && !isPastDate ? handleDateClick(currentDate) : null
          }
        >
          <div className="text-xs">
            {currentDate.format('ddd').toUpperCase()}
          </div>
          <div className="text-lg">{currentDate.format('DD')}</div>
        </div>
      )
    }

    return dateColumns
  }

  const endOfWeek = moment().add(weeksToShow, 'weeks').startOf('week')
  const isSameWeek = currentWeek.isSame(endOfWeek, 'week')

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeModal()
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
        closeModal()
      }
    }

    window.addEventListener('mouseup', handleClickOutside)

    return () => {
      window.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])

  const handleStepsRegister = () => {
    switch (stepReg) {
      case 1:
        return (
          <div>
            <form
              onSubmit={regHandleSubmit(onSubmitRegister)}
              className="mt-16"
            >
              <div className="mb-4">
                <div className="w-full inline-flex bg-gray-200">
                  <div className="w-1/12 flex justify-center items-center ">
                    <AiOutlineUser size={25} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    {...regRegister('name', { required: 'Name is required' })}
                    className="block w-full p-2 text-lg rounded-sm bg-gray-100 focus:border-gray-500 outline-none"
                    placeholder="Your name"
                  />
                </div>

                {regErrors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {regErrors.name.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="w-full inline-flex bg-gray-200">
                  <div className="w-1/12 flex justify-center items-center ">
                    <BiUserCheck size={25} />
                  </div>

                  <input
                    id="username"
                    type="text"
                    {...regRegister('username', {
                      required: true,
                      minLength: 4,
                      pattern: {
                        value: /^[a-z]+$/,
                      },
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-gray-100 focus:border-gray-500 outline-none"
                    placeholder="Username"
                  />
                </div>

                {regErrors.username?.type === 'minLength' && (
                  <p className="text-red-500 text-xs mt-1">
                    Username must be at least 4 characters long
                  </p>
                )}

                {usernameCheck?.length >= 4 &&
                  (usernameAvailable ? (
                    <p className="text-green-400 text-xs mt-1 flex justify-start items-center">
                      <AiFillCheckCircle size={16} />
                      <span className="ml-1">Username available </span>
                    </p>
                  ) : (
                    <p className="text-red-400 text-xs mt-1 flex justify-start items-center">
                      <BiSolidErrorCircle />
                      <span className="ml-1">{usernameMsg}</span>
                    </p>
                  ))}

                {regErrors.username && (
                  <p className="text-red-500 text-xs mt-1">
                    {regErrors.username.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="w-full inline-flex bg-gray-200">
                  <div className="w-1/12 flex justify-center items-center ">
                    <BsEnvelope size={25} />
                  </div>
                  <input
                    type="text"
                    {...regRegister('email', {
                      required: 'Email is required',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-gray-100 focus:border-gray-500 outline-none"
                    placeholder="Email address"
                  />
                </div>

                {regErrors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {regErrors.email.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="w-full inline-flex bg-gray-200">
                  <div className="w-1/12 flex justify-center items-center ">
                    <BsPhone size={25} />
                  </div>
                  <input
                    id="phone"
                    type="text"
                    {...regRegister('phone', {
                      required: 'Phone is required',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-gray-100 focus:border-gray-500 outline-none"
                    placeholder="Phone number"
                  />
                </div>

                {regErrors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {regErrors.phone.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="w-full inline-flex bg-gray-200">
                  <div className="w-1/12 flex justify-center items-center ">
                    <RiLockPasswordLine size={25} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    {...regRegister('password', {
                      required: 'Password is required',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-gray-100 focus:border-gray-500 outline-none"
                    placeholder="Password"
                  />
                </div>

                {regErrors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {regErrors.password.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="w-full inline-flex bg-gray-200">
                  <div className="w-1/12 flex justify-center items-center ">
                    <RiLockPasswordLine size={25} />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...regRegister('confirmPassword', {
                      required: 'Confirm password is required',
                      validate: (value) =>
                        value === regWatch('password') ||
                        'Passwords do not match',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-gray-100 focus:border-gray-500 outline-none"
                    placeholder="Confirm password"
                  />
                </div>

                {regErrors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {regErrors.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="px-2 pb-2 pt-2">
                <button
                  type="submit"
                  className="uppercase block w-full p-2 text-lg rounded-full bg-sky-500 hover:bg-sky-600 focus:outline-none text-white"
                >
                  Continue
                </button>
              </div>
            </form>

            <p className="w-full my-6 text-white text-center">OR</p>

            <GoogleAuthBooking
              setLoading={setLoadingModal}
              loading={loadingModal}
              success={successModal}
              setSuccess={setSuccessModal}
              error={errorModal}
              setError={setErrorModal}
              schedules={redirectLink}
              trainer={data?._id}
              username={username}
            />

            <h6 className="text-center text-muted my-4 ">
              Have an account?{' '}
              <button
                onClick={() => setOpenTab(1)}
                className="text-md  hover:underline  hover:text-sky-500"
              >
                Login
              </button>
            </h6>
          </div>
        )
      case 2:
        return (
          <>
            <p className="text-center mt-16">
              Please enter verification code for email verification
            </p>
            <div className="flex justify-between items-center my-16">
              {codeInputs.map((inp, index) => {
                return (
                  <input
                    type="text"
                    className="text-center block w-full px-4 py-2 mt-2 text-black bg-gray-100 focus:border-gray-500 rounded-md focus:outline-none focus:ring focus:ring-opacity-40 mx-3 text-xl outline-none"
                    maxLength={1}
                    value={otp[index]}
                    placeholder="0"
                    name="vcode"
                    onChange={(e) => handleChangeCodeText(e, index)}
                    ref={nextInputCodeIndex === index ? inputCodeRef : null}
                    key={index}
                  />
                )
              })}
            </div>
            <br />

            <div className="flex justify-center items-center">
              <div className="px-2 pb-2 pt-2 w-3/4">
                <button
                  onClick={handleCompleteRegistration}
                  disabled={loading}
                  className="uppercase block w-full p-2 text-lg rounded-full bg-sky-500 hover:bg-sky-600 focus:outline-none text-white"
                >
                  Verify Code
                </button>
              </div>
            </div>

            <br />
          </>
        )
      default:
        return null
    }
  }

  const handleSteps = () => {
    switch (step) {
      case 1:
        return (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
              <div className="my-6">
                <div className="w-full inline-flex bg-gray-200">
                  <div className="w-1/12 flex justify-center items-center ">
                    <BiUserCheck size={25} />
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    {...register('identifier', {
                      required: 'Email or username is required',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-gray-100 focus:border-gray-500 outline-none"
                    placeholder="Email or username "
                  />
                </div>

                {errors.identifier && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.identifier.message}
                  </p>
                )}
              </div>

              <div className="mt-6 mb-2">
                <div className="w-full inline-flex bg-gray-200">
                  <div className="w-1/12 flex justify-center items-center ">
                    <RiLockPasswordLine size={25} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-gray-100 focus:border-gray-500 outline-none"
                    placeholder="Password"
                  />
                </div>

                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end items-center">
                <p onClick={() => setStep(2)} className="mb-2 cursor-pointer">
                  Forgot password?
                </p>
              </div>

              <div className="px-2 pb-2 pt-2">
                <button
                  type="submit"
                  className="uppercase block w-full p-2 text-lg rounded-full bg-sky-500 hover:bg-sky-600 focus:outline-none text-white"
                >
                  Login
                </button>
              </div>
            </form>

            <p className="w-full my-6 text-white text-center">OR</p>

            <GoogleAuthBooking
              setLoading={setLoadingModal}
              loading={loadingModal}
              success={successModal}
              setSuccess={setSuccessModal}
              error={errorModal}
              setError={setErrorModal}
              schedules={redirectLink}
              trainer={data?._id}
              username={username}
            />

            <h6 className="text-center text-muted my-4 ">
              Don't have an account?{' '}
              <button
                onClick={() => setOpenTab(2)}
                className="text-md  hover:underline  hover:text-sky-500"
              >
                Register
              </button>
            </h6>
          </>
        )

      case 2:
        return (
          <>
            <form onSubmit={handleSubmitEmail(emailSubmit)} className="mt-16">
              <div className="my-6">
                <div className="w-full inline-flex bg-gray-200">
                  <div className="w-1/12 flex justify-center items-center ">
                    <BiUserCheck size={25} />
                  </div>
                  <input
                    id="identifierUsrOrEmail"
                    type="text"
                    {...registerForget('identifierUsrOrEmail', {
                      required: 'Email or username is required',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-gray-100 focus:border-gray-500 outline-none"
                    placeholder="Email or username "
                  />
                </div>

                {errorsEmail.identifierUsrOrEmail && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorsEmail.identifierUsrOrEmail.message}
                  </p>
                )}
              </div>

              <div className="px-2 pb-2 pt-2">
                <button className="uppercase block w-full p-2 text-lg rounded-full bg-sky-500 hover:bg-sky-600 focus:outline-none text-white">
                  Reset password
                </button>
              </div>
            </form>

            <div className="flex justify-center items-center">
              <button
                onClick={() => setStep(1)}
                className="text-center text-muted my-4 "
              >
                Login
              </button>
            </div>
          </>
        )
      case 3:
        return (
          <>
            <p className="text-center mt-16">
              Please enter verification code for password changing.
            </p>
            <div className="flex justify-between items-center my-16">
              {codeInputs.map((inp, index) => {
                return (
                  <input
                    type="text"
                    className="text-center block w-full px-4 py-2 mt-2 text-black bg-gray-200 focus:border-gray-500 border rounded-md  focus:outline-none focus:ring focus:ring-opacity-40 mx-3 text-xl outline-none"
                    maxLength={1}
                    value={otp[index]}
                    placeholder="0"
                    name="vcode"
                    onChange={(e) => handleChangeCodeText(e, index)}
                    ref={nextInputCodeIndex === index ? inputCodeRef : null}
                    key={index}
                  />
                )
              })}
            </div>
            <br />

            <div className="flex justify-center items-center">
              <div className="px-2 pb-2 pt-2 w-3/4">
                <button
                  onClick={handleVerification}
                  disabled={loading}
                  className="uppercase block w-full p-2 text-lg rounded-full bg-sky-500 hover:bg-sky-600 focus:outline-none text-white"
                >
                  Verify Code
                </button>
              </div>
            </div>

            <div className="flex justify-center items-center">
              <button
                onClick={() => setStep(1)}
                className="text-center text-muted my-4 "
              >
                Login
              </button>
            </div>

            <br />
          </>
        )
      case 4:
        return (
          <>
            <p className="text-center mt-16">Create new password</p>

            <form
              onSubmit={handleSubmitPassword(handleUpdatePassword)}
              className="mt-16"
            >
              <div className="mt-6 mb-2">
                <div className="w-full inline-flex bg-gray-200">
                  <div className="w-1/12 flex justify-center items-center ">
                    <RiLockPasswordLine size={25} />
                  </div>
                  <input
                    id="newPassword"
                    type="password"
                    {...registerPassword('newPassword', {
                      required: 'Password is required',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-gray-100 focus:border-gray-500 outline-none"
                    placeholder="Password"
                  />
                </div>

                {errorsPassword.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorsPassword.newPassword.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <div className="w-full inline-flex bg-gray-200">
                  <div className="w-1/12 flex justify-center items-center ">
                    <RiLockPasswordLine size={25} />
                  </div>
                  <input
                    id="confirmPassword"
                    type="password"
                    {...registerPassword('confirmPassword', {
                      required: 'Confirm password is required',
                      validate: (value) =>
                        value === watchPassword('newPassword') ||
                        'Passwords do not match',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-gray-100 focus:border-gray-500 outline-none"
                    placeholder="Confirm password"
                  />
                </div>

                {errorsPassword.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorsPassword.confirmPassword.message}
                  </p>
                )}
              </div>

              <div className="px-2 pb-2 pt-2">
                <button className="uppercase block w-full p-2 text-lg rounded-full bg-sky-500 hover:bg-sky-600 focus:outline-none text-white">
                  Create new password
                </button>
              </div>
            </form>

            <div className="flex justify-center items-center">
              <button
                onClick={() => setStep(1)}
                className="text-center text-muted my-4 "
              >
                Login
              </button>
            </div>
          </>
        )
      default:
        return null
    }
  }

  return (
    <>
      <WebNavBar />

      {loading ? (
        <div className="flex flex-wrap justify-center">
          <Lottie
            config={{
              animationData: animationData,
              loop: true,
              autoplay: true,
            }}
            height={100}
            width={120}
          />
        </div>
      ) : (
        <div className="w-full min-h-min">
          <div className="-mx-4 sm:-mx-8 sm:px-8 overflow-x-auto">
            {showModal && (
              <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
                <div
                  ref={divRef}
                  className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-2/3 lg:w-1/3 xl:w:2/3 pb-2 overflow-y-auto max-h-[100vh]"
                >
                  <div className="flex justify-between items-center p-4">
                    <div className="flex justify-center items-center w-full h-full">
                      <h3 className="text-center text-2xl text-slate-700">
                        {openTab === 1 ? 'Login' : 'Create an account'}
                      </h3>
                    </div>
                    <div className="flex">
                      <button onClick={closeModal} className="shadow-none">
                        <img
                          src={cancelIcon}
                          alt="Cancel"
                          width={20}
                          height={20}
                          className="object-contain"
                        />
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

                    {openTab === 1 && <div>{handleSteps()}</div>}
                    {openTab === 2 && <div>{handleStepsRegister()}</div>}
                  </div>
                </div>
              </div>
            )}
          </div>

          <section className="h-[30rem] w-full bg-[url('https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1280&dpr=2')] bg-cover bg-center"></section>
          <section className="bg-blueGray-200">
            <div className="container mx-auto">
              {!loading && error === 'Access denied. Invalid request!' ? (
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                  <div className="px-6 py-6">
                    <div className="text-center mt-4">
                      <h3 className="text-4xl font-semibold leading-normal text-blueGray-700 mb-2 text-red-500">
                        No trainer found!
                      </h3>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-xl rounded-lg -mt-64">
                  <div className="px-6 py-6">
                    <div className="flex flex-wrap justify-center">
                      <div className="w-full lg:w-3/12 px-4 lg:order-2 flex justify-center">
                        <img
                          src={data?.profile_image_link}
                          alt={data?.name}
                          className="rounded-full"
                          style={{
                            width: '8rem',
                            height: '8rem',
                            objectFit: 'cover',
                          }}
                        />
                      </div>
                    </div>
                    <div className="text-center mt-4">
                      <h3 className="text-lg leading-normal text-blueGray-700 mb-2">
                        {data &&
                          data?.categories &&
                          data?.categories?.map((category, index) => (
                            <span key={category._id}>
                              {category.name}
                              {index !== data.categories.length - 1
                                ? ' | '
                                : ''}
                            </span>
                          ))}
                      </h3>

                      <h3 className="text-4xl font-semibold leading-normal text-blueGray-700 mb-2">
                        {data?.name}
                      </h3>
                    </div>

                    <div className="mt-8 flex justify-center items-center">
                      {currentWeek.isAfter(moment().startOf('week')) && (
                        <button
                          onClick={() => handleDateChange('prev')}
                          className="mr-1 md:mr-12"
                        >
                          <MdArrowBackIos size={24} />
                        </button>
                      )}
                      <div className="grid grid-cols-7 gap-4 md:gap-12">
                        {renderDateColumns()}
                      </div>
                      {!isSameWeek && (
                        <button
                          onClick={() => handleDateChange('next')}
                          className="ml-1 md:ml-12"
                        >
                          <MdArrowForwardIos size={24} />
                        </button>
                      )}
                    </div>

                    <div className="mt-8">
                      <div className="flex justify-center items-center">
                        <div
                          className="w-1/3 "
                          style={{
                            border: '0.5px solid #d2d2d2',
                          }}
                        ></div>
                        <h2 className="w-1/3 text-1xl font-semibold mb-4 text-center pt-3">
                          Schedules on {selectedDate.format('dddd, MMMM D')}
                        </h2>
                        <div
                          className="w-1/3 "
                          style={{
                            border: '0.5px solid #d2d2d2',
                          }}
                        ></div>
                      </div>

                      <div>
                        {scheduleLoading && (
                          <div className="flex flex-wrap justify-center">
                            <Lottie
                              config={{
                                animationData: animationData,
                                loop: true,
                                autoplay: true,
                              }}
                              height={100}
                              width={120}
                            />
                          </div>
                        )}

                        {!scheduleLoading && (
                          <div>
                            {(() => {
                              let hasSchedulesForSelectedDate = false

                              const scheduleItems = schedules
                                .flatMap((schedule) => {
                                  return schedule.timeSlots.map((timeSlot) => {
                                    const isScheduleOnSelectedDate =
                                      moment(selectedDate).isBetween(
                                        moment(timeSlot.start),
                                        moment(timeSlot.end),
                                        undefined,
                                        '[]'
                                      ) ||
                                      moment(selectedDate).isSame(
                                        moment(timeSlot.start),
                                        'day'
                                      ) ||
                                      moment(selectedDate).isSame(
                                        moment(timeSlot.end),
                                        'day'
                                      )

                                    if (isScheduleOnSelectedDate) {
                                      hasSchedulesForSelectedDate = true

                                      const isUserTrainer =
                                        user && user?.id === schedule?.trainer

                                      return (
                                        <div
                                          key={timeSlot._id}
                                          className="mb-4 w-full flex flex-col md:flex-row justify-between items-center border-b border-gray-200 pb-4"
                                        >
                                          <div className="flex w-full md:w-1/2 justify-start items-center border-r-0 md:border-r">
                                            <img
                                              src={schedule.category.catImg}
                                              alt="Category"
                                              className="w-52 h-32 rounded-sm"
                                            />
                                            <div className="mx-4">
                                              <p className="text-md">
                                                {schedule.category.name}
                                              </p>
                                              <p className="text-lg font-bold">
                                                {schedule.title}
                                              </p>
                                              <p className="text-md">
                                                {schedule.location}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex w-full md:w-1/2 justify-between items-center ml-4 my-4 md:my-0">
                                            <div>
                                              <p className="text-xl text-sky-500 font-bold">
                                                <span className="text-slate-600 w-16 inline-block">
                                                  Start:
                                                </span>
                                                {moment(timeSlot.start).format(
                                                  'h:mm A'
                                                )}
                                              </p>
                                              <p className="text-xl text-slate-500">
                                                <span className="text-slate-600 w-16 inline-block">
                                                  End:
                                                </span>
                                                {moment(timeSlot.end).format(
                                                  'h:mm A'
                                                )}
                                              </p>
                                            </div>
                                            <div className="ml-4 flex justify-center items-center">
                                              {schedule?.pricing
                                                .sort(
                                                  (a, b) => a.price - b.price
                                                )
                                                .slice(0, 1)
                                                .map((p) => (
                                                  <p
                                                    className="text-2xl"
                                                    key={p?._id}
                                                  >
                                                    ${p?.price.toFixed(2)}
                                                  </p>
                                                ))}
                                              {!isUserTrainer && (
                                                <>
                                                  {!user ? (
                                                    <button
                                                      onClick={() => {
                                                        handleModalOpen()
                                                        setRedirectLink(
                                                          schedule?._id
                                                        )
                                                      }}
                                                      className="bg-sky-500 text-white px-10 py-2 ml-3 focus:outline-none focus:shadow-outline focus:border-none"
                                                    >
                                                      BOOK
                                                    </button>
                                                  ) : (
                                                    <Link
                                                      to={`/trainer/${username}/${
                                                        schedule?._id
                                                      }/${moment(
                                                        selectedDate
                                                      ).format('DD-MM-YYYY')}`}
                                                      className="bg-sky-500 text-white px-10 py-2 ml-3 focus:outline-none focus:shadow-outline focus:border-none"
                                                    >
                                                      BOOK
                                                    </Link>
                                                  )}
                                                </>
                                              )}
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    }

                                    return null
                                  })
                                })
                                .filter(Boolean)

                              if (!hasSchedulesForSelectedDate) {
                                scheduleItems.push(
                                  <p
                                    key="no-schedules"
                                    className="text-center my-2 text-slate-600"
                                  >
                                    No available schedules for the selected
                                    date.
                                  </p>
                                )
                              }

                              return scheduleItems
                            })()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      <Footer />
    </>
  )
}

export default PublicProfile
