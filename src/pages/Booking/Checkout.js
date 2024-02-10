import React, { useState, useEffect, useRef } from 'react'
import moment from 'moment'
import { getTrainerAndScheduleByIdFrontend } from '../../components/functions/user'
import WebNavBar from '../../components/nav/WebNavBar'
import { Lottie } from '@crello/react-lottie'
import animationData from '../../assets/loader.json'
import { toast } from 'react-toastify'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'
import { Elements } from '@stripe/react-stripe-js'
import { stripePaymentIntent } from '../../components/functions/payment'
import { useSelector } from 'react-redux'
import StripeCheckout from './StripeCheckout'
import { loadStripe } from '@stripe/stripe-js'
import { Link, useNavigate } from 'react-router-dom'
const cancelIcon = require('../../assets/cancel-icon.png')

const Checkout = () => {
  const navigate = useNavigate()
  const keys = loadStripe('pk_test_YCcfrSph80wEkwZHPUsyFGem00JEUfvihE')
  const [loading, setLoading] = useState(false)
  const user = useSelector((state) => state.user)
  const [error, setError] = useState('')
  const [bookingDetails, setBookingDetails] = useState(null)
  const [schedule, setSchedule] = useState(null)
  const [selectedPriceDetail, setSelectedPriceDetail] = useState(null)
  const [past, setPast] = useState(false)
  const [openSelect, setOpenSelect] = useState(false)
  const [clientSecret, setClientSecret] = useState('')
  const [loadingPayment, setLoadingPayment] = useState(false)
  const [checkoutData, setCheckoutData] = useState({})
  const [succeeded, setSucceeded] = useState(false)

  const divRef = useRef()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const bookingDetailsString = localStorage.getItem('bookingDetails')
      if (bookingDetailsString) {
        const details = JSON.parse(bookingDetailsString)

        setBookingDetails(details)

        try {
          const scheduleData = await getTrainerAndScheduleByIdFrontend(
            details?.trainerUsername,
            details?.trainerId,
            setError
          )
          if (scheduleData) {
            setSchedule(scheduleData?.data?.schedule)
            const selectedPrice = scheduleData?.data?.schedule?.pricing?.find(
              (price) => price._id === details.selectedPrice
            )
            setSelectedPriceDetail(selectedPrice)
          }
        } catch (error) {
          console.error('Error fetching schedule:', error)
          setError('Failed to fetch schedule')
        }
      }
      setLoading(false)
    }

    fetchData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const processedData = schedule?.pricing?.map((item) => ({
    ...item,
    label: `${item.title} - $${item.price}`,
  }))

  const formatDateTime = (date, timeSlot) => {
    return `${moment(date).format('dddd, MMMM Do YYYY')} at ${timeSlot}`
  }

  const findSelectedTimeSlot = (timeSlots, selectedTimeSlotId) => {
    return timeSlots?.find((slot) => slot._id === selectedTimeSlotId)
  }

  const formatTimeSlot = (timeSlot) => {
    if (!timeSlot) return 'Unavailable'
    return `${moment(timeSlot.start).format('h:mm A')} - ${moment(
      timeSlot.end
    ).format('h:mm A')}`
  }

  const selectedTimeSlot = findSelectedTimeSlot(
    schedule?.timeSlots,
    bookingDetails?.selectedTimeSlot
  )
  const formattedTimeSlot = formatTimeSlot(selectedTimeSlot)

  const formatDateTimeCompare = (date, timeSlot) => {
    if (!date || timeSlot === 'Unavailable') {
      return null
    }

    return moment(`${date} ${timeSlot}`, 'YYYY-MM-DD hh:mm A').format('LLL')
  }

  useEffect(() => {
    if (!bookingDetails?.selectedDate || !formattedTimeSlot) {
      return
    }

    const currentDate = moment().format('LLL')
    const currentDateTime = moment(currentDate, 'LLL')
    const selectedDateTime = moment(
      formatDateTimeCompare(bookingDetails?.selectedDate, formattedTimeSlot),
      'LLL'
    )

    if (selectedDateTime.isBefore(currentDateTime)) {
      localStorage.removeItem('bookingDetails')
      setBookingDetails(null)
      toast.error('Past dates')
      setPast(true)
      setLoading(false)
    }
  }, [bookingDetails, formattedTimeSlot])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (divRef.current && !divRef.current.contains(event.target)) {
        setOpenSelect(false)
      }
    }

    window.addEventListener('mouseup', handleClickOutside)

    return () => {
      window.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenSelect(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const paymentProcessing = async () => {
    const newData = {
      userId: user?.id,
      email: user?.email,
      name: user.name,
      total: Math.round(selectedPriceDetail.price * 100),
    }

    setLoadingPayment(false)

    try {
      setLoadingPayment(true)
      const res = await stripePaymentIntent(newData, user?.token, setError)
      if (res.status === 200) {
        setClientSecret(res.data.clientSecret)
        setCheckoutData({
          scheduleId: schedule?._id,
          amount: Math.round(selectedPriceDetail.price * 100),
          trainer: schedule?.trainer,
        })
      }
      setLoadingPayment(false)
    } catch (error) {
      setLoadingPayment(false)
    }
  }

  const closeModal = () => {
    setSucceeded(false)
    navigate('/dashboard')
  }

  return (
    <>
      <WebNavBar />

      <div className="container mx-auto p-4">
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
          <div>
            {succeeded && (
              <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
                <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-1/2 pb-2 overflow-y-auto max-h-[100vh]">
                  <div className="bg-gray-100 border-b px-4 py-6 flex justify-between items-center rounded-lg">
                    <h3 className="font-semibold text-xl text-stone-600">
                      Payment successful
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
                    <div className="flex items-center justify-center text-green-500">
                      <svg
                        className="h-12 w-12"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    </div>
                    <p className="text-lg text-gray-700 mt-4 text-center">
                      Payment was successful!
                    </p>
                  </div>
                </div>
              </div>
            )}
            {!bookingDetails && succeeded ? (
              <div className="flex flex-col items-center justify-center">
                <h2 className="text-2xl font-semibold mb-4 text-center">
                  See payment history and booking details on your dashboard
                </h2>
                <Link
                  to={`/dashboard`}
                  className="bg-sky-500 text-white px-10 py-2 focus:outline-none focus:shadow-outline focus:border-none"
                >
                  Dashboard
                </Link>
              </div>
            ) : !bookingDetails ? (
              <h2 className="text-2xl font-semibold mb-4 text-center">
                Schedule not found.
              </h2>
            ) : (
              <div>
                <h1 className="text-3xl font-bold text-center mb-6">
                  Checkout
                </h1>
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-1/2 p-4">
                    <h2 className="text-2xl font-semibold mb-4">
                      Pricing Options
                    </h2>

                    <div className="mt-4">
                      <div className="w-full relative">
                        <button
                          onClick={() => setOpenSelect(!openSelect)}
                          className="px-4 py-2 rounded-sm border w-full"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <div>{selectedPriceDetail?.title}</div>
                            </div>
                            <div className="flex items-center">
                              <div>
                                ${selectedPriceDetail?.price.toFixed(2)}
                              </div>
                              {openSelect ? (
                                <SlArrowUp size={14} className="ml-4" />
                              ) : (
                                <SlArrowDown size={14} className="ml-4" />
                              )}
                            </div>
                          </div>
                        </button>

                        {openSelect && (
                          <div
                            className="absolute z-10 shadow p-4 bg-white rounded-md w-full "
                            ref={divRef}
                          >
                            {schedule?.pricing
                              ?.sort((a, b) => a.price - b.price)
                              ?.map((pc) => {
                                const isSelected =
                                  selectedPriceDetail &&
                                  selectedPriceDetail._id === pc._id
                                return (
                                  <div
                                    key={pc?._id}
                                    className={`flex justify-between items-center p-2 cursor-pointer ${
                                      isSelected
                                        ? 'bg-sky-500 text-white'
                                        : 'hover:bg-sky-500 hover:text-white'
                                    }`}
                                    onClick={() => {
                                      const updatedBookingDetails = {
                                        ...bookingDetails,
                                        selectedPrice: pc?._id,
                                      }
                                      localStorage.setItem(
                                        'bookingDetails',
                                        JSON.stringify(updatedBookingDetails)
                                      )
                                      setSelectedPriceDetail(pc)
                                      setOpenSelect(false)
                                    }}
                                  >
                                    <div>
                                      <div>{pc?.title}</div>
                                    </div>
                                    <div className="flex items-center">
                                      <div>${pc?.price.toFixed(2)}</div>
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                        )}
                      </div>
                    </div>
                    {bookingDetails && (
                      <p className="mt-4">
                        <strong>Selected Date & Time:</strong>{' '}
                        {formatDateTime(
                          bookingDetails?.selectedDate,
                          formattedTimeSlot
                        )}
                      </p>
                    )}
                  </div>

                  <div className="w-full md:w-1/2 p-4 ">
                    <h2 className="text-2xl font-semibold mb-4">
                      Order Summary
                    </h2>
                    {schedule && (
                      <div>
                        <img
                          src={schedule?.category?.catImg}
                          alt={schedule.title}
                          className="w-52 h-32 rounded-sm mb-4"
                        />
                        <h3 className="text-xl font-bold">{schedule?.title}</h3>
                        <p className="mb-2">
                          {formatDateTime(
                            bookingDetails?.selectedDate,
                            formattedTimeSlot
                          )}
                        </p>
                      </div>
                    )}
                    {selectedPriceDetail && (
                      <div>
                        <p>{selectedPriceDetail.title}</p>
                        <p className="my-4">
                          <strong>Total:</strong> $
                          {selectedPriceDetail.price.toFixed(2)}
                        </p>
                      </div>
                    )}

                    {!clientSecret && (
                      <div className="px-2 pb-2 pt-2">
                        <button
                          onClick={paymentProcessing}
                          className={`block w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded mr-10 px-10 ${
                            loadingPayment && 'ActionButton'
                          }`}
                          type="submit"
                        >
                          Process for payment
                        </button>
                      </div>
                    )}

                    {clientSecret && keys && (
                      <Elements stripe={keys} options={{ clientSecret }}>
                        <div className="px-2 pb-2 pt-2">
                          <StripeCheckout
                            setClientSecret={setClientSecret}
                            clientSecret={clientSecret}
                            selectedPriceDetail={selectedPriceDetail}
                            setLoadingPayment={setLoadingPayment}
                            loadingPayment={loadingPayment}
                            checkoutData={checkoutData}
                            setCheckoutData={setCheckoutData}
                            setError={setError}
                            setBookingDetails={setBookingDetails}
                            setSucceeded={setSucceeded}
                          />
                        </div>
                      </Elements>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default Checkout
