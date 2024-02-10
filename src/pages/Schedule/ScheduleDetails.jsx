import React, { useState, useEffect, useRef } from 'react'
import WebNavBar from '../../components/nav/WebNavBar'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import moment from 'moment'
import { getTrainerAndScheduleByIdFrontend } from '../../components/functions/user'
import Footer from '../../components/footer/Footer'
import { Lottie } from '@crello/react-lottie'
import animationData from '../../assets/loader.json'
import { useSelector } from 'react-redux'
import { SlArrowDown, SlArrowUp } from 'react-icons/sl'
import DatePicker from 'react-datepicker'
import { toast } from 'react-toastify'

const ScheduleDetails = () => {
  const divRef = useRef()
  const navigate = useNavigate()
  const location = useLocation()
  const { username, id, date } = useParams()
  const [data, setData] = useState([])
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState(
    date ? moment(date, 'DD-MM-YYYY').startOf('day') : moment().startOf('day')
  )
  const [clickableDates, setClickableDates] = useState([])
  const user = useSelector((state) => state.user)
  const [showCalendar, setShowCalendar] = useState(false)
  const [selectedPrice, setSelectedPrice] = useState(null)
  const [openSelect, setOpenSelect] = useState(false)
  const [openSelectTime, setOpenSelectTime] = useState(false)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null)

  const getTrainer = async () => {
    try {
      setLoading(true)
      const res = await getTrainerAndScheduleByIdFrontend(
        username,
        id,
        setError
      )

      if (res && res.status === 200) {
        const { schedule, user } = res.data

        setData(user)
        setSchedules(schedule)

        const scheduleDates = schedule.timeSlots.flatMap((timeSlot) => {
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

        setClickableDates([...new Set(scheduleDates)])

        const availableTimeSlots = filterTimeSlotsForSelectedDate()
        if (availableTimeSlots.length > 0) {
          setSelectedTimeSlot(availableTimeSlots[0])
        }

        const lowestPriceItem = schedule.pricing.reduce(
          (minPriceItem, currentItem) =>
            currentItem.price < minPriceItem.price ? currentItem : minPriceItem,
          schedule.pricing[0]
        )
        setSelectedPrice(lowestPriceItem)
      }
      setLoading(false)
    } catch (error) {
      console.error('Error fetching data:', error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getTrainer()
  }, [username, id, date])

  const handleDateChange = (date) => {
    setSelectedDate(moment(date))
    setShowCalendar(false)
  }

  const isDateClickable = (date, clickableDates) => {
    const formattedDate = moment(date).format('YYYY-MM-DD')
    return clickableDates.includes(formattedDate)
  }

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setShowCalendar(false)
        setOpenSelect(false)
        setOpenSelectTime(false)
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
        setShowCalendar(false)
        setOpenSelect(false)
        setOpenSelectTime(false)
      }
    }

    window.addEventListener('mouseup', handleClickOutside)

    return () => {
      window.removeEventListener('mouseup', handleClickOutside)
    }
  }, [])

  const filterTimeSlotsForSelectedDate = () => {
    return (
      schedules?.timeSlots?.filter((timeSlot) => {
        const start = moment(timeSlot.start)
        const end = moment(timeSlot.end)
        return (
          selectedDate.isSame(start, 'day') ||
          selectedDate.isSame(end, 'day') ||
          (selectedDate.isAfter(start, 'day') &&
            selectedDate.isBefore(end, 'day'))
        )
      }) || []
    )
  }

  useEffect(() => {
    const availableTimeSlots = filterTimeSlotsForSelectedDate()
    const futureTimeSlots = availableTimeSlots.filter((slot) => !slot.isPast)
    if (futureTimeSlots.length > 0) {
      setSelectedTimeSlot(futureTimeSlots[0])
    } else {
      setSelectedTimeSlot(null)
    }
  }, [selectedDate, schedules])

  const timeSlotOptions = filterTimeSlotsForSelectedDate().map((timeSlot) => ({
    value: timeSlot._id,
    label: `${moment(timeSlot.start).format('h:mm A')} - ${moment(
      timeSlot.end
    ).format('h:mm A')}`,
  }))

  const handleBooking = () => {
    if (!selectedTimeSlot.value) {
      return toast.error('You must select time')
    }

    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return toast.error('You must login to book a schedule')
    }

    const bookingDetails = {
      trainerUsername: username,
      trainerId: id,
      scheduleId: schedules?._id,
      selectedDate: selectedDate.format('YYYY-MM-DD'),
      selectedTimeSlot: selectedTimeSlot?.value,
      selectedPrice: selectedPrice?._id,
    }

    localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails))

    // const pastDate1 = moment().subtract(3, 'days')
    // const pastDate2 = moment().subtract(5, 'days')
    // // Add more past dates as needed

    // const bookingDetails = {
    //   trainerUsername: username,
    //   trainerId: id,
    //   scheduleId: schedules?._id,
    //   selectedDate: pastDate1.format('YYYY-MM-DD'),
    //   selectedTimeSlot: selectedTimeSlot?.value,
    //   selectedPrice: selectedPrice?._id,
    // }

    // localStorage.setItem('bookingDetails', JSON.stringify(bookingDetails))
    navigate('/checkout')
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
                    <div className="flex flex-col lg:flex-row justify-center items-center">
                      <div className="w-full lg:w-6/12 px-4 lg:order-1 flex justify-center mb-4 lg:mb-0">
                        {schedules && schedules?.category && (
                          <img
                            src={schedules?.category?.catImg}
                            alt={schedules?.category?.name}
                            className="w-full h-full mr-2 rounded-sm"
                          />
                        )}
                      </div>

                      <div className="w-full lg:w-6/12 px-4 lg:order-1">
                        <h3 className="text-lg leading-normal text-blueGray-700 mb-2">
                          {schedules && schedules?.category?.name}
                        </h3>
                        <h3 className="text-3xl leading-normal text-blueGray-700 mb-2">
                          {schedules && schedules?.title}
                        </h3>

                        <div className="flex items-center mb-4">
                          <img
                            src={data?.profile_image_link}
                            alt={data?.name}
                            className="rounded-full w-12 h-12 mr-4"
                          />
                          <p className="text-md text-slate-600 font-semibold">
                            {data?.name}
                          </p>
                        </div>

                        <div className="flex flex-col md:flex-row items-center">
                          <div className="mb-2 md:mb-0 w-full md:w1/2">
                            <button
                              onClick={() => setShowCalendar(!showCalendar)}
                              className="text-black px-4 py-2 rounded-sm border flex justify-center items-center focus:outline-none focus:shadow-outline w-full"
                            >
                              {selectedDate.format('dddd, D MMM')}
                              {showCalendar ? (
                                <SlArrowUp size={14} className="ml-4" />
                              ) : (
                                <SlArrowDown size={14} className="ml-4" />
                              )}
                            </button>

                            {showCalendar && (
                              <div
                                className="absolute z-10 shadow p-4 bg-white rounded-md"
                                ref={divRef}
                              >
                                <DatePicker
                                  selected={selectedDate.toDate()}
                                  onChange={(date) => handleDateChange(date)}
                                  inline
                                  minDate={moment().startOf('day').toDate()}
                                  maxDate={moment()
                                    .add(1, 'month')
                                    .endOf('month')
                                    .toDate()}
                                  filterDate={(date) =>
                                    isDateClickable(date, clickableDates)
                                  }
                                  calendarClassName="custom-calendar"
                                />
                              </div>
                            )}
                          </div>

                          <div className="w-full relative">
                            <div className="w-full items-center justify-center">
                              <div className="mb-2 md:mb-0 w-full md:w1/2 md:pl-4">
                                <button
                                  onClick={() =>
                                    setOpenSelectTime(!openSelectTime)
                                  }
                                  className="px-4 py-2 rounded-sm border w-full"
                                >
                                  <div className="flex justify-center items-center">
                                    <div className="pr-1">
                                      {!selectedTimeSlot?.label && 'Time'}
                                      {selectedTimeSlot?.label}
                                    </div>
                                    <div className="flex items-center">
                                      {openSelectTime ? (
                                        <SlArrowUp size={14} className="ml-4" />
                                      ) : (
                                        <SlArrowDown
                                          size={14}
                                          className="ml-4"
                                        />
                                      )}
                                    </div>
                                  </div>
                                </button>
                              </div>

                              {openSelectTime && (
                                <div
                                  className="absolute z-10 shadow p-4 bg-white rounded-md w-full ml-4"
                                  ref={divRef}
                                >
                                  {timeSlotOptions?.map((timeSlotOption) => {
                                    const isSelected =
                                      selectedTimeSlot?.value ===
                                      timeSlotOption?.value

                                    const startTimeStr =
                                      timeSlotOption?.label.split(' - ')[0]
                                    const startTime = moment(
                                      `${selectedDate.format(
                                        'YYYY-MM-DD'
                                      )} ${startTimeStr}`,
                                      'YYYY-MM-DD h:mm A'
                                    )

                                    const isPast = moment().isAfter(startTime)

                                    return (
                                      <div
                                        key={timeSlotOption.value}
                                        className={`flex justify-between items-center p-2 ${
                                          isSelected
                                            ? 'bg-sky-500 text-white'
                                            : isPast
                                            ? 'bg-gray-400 text-white cursor-not-allowed'
                                            : 'hover:bg-sky-500 hover:text-white cursor-pointer'
                                        }`}
                                        onClick={() => {
                                          if (!isPast) {
                                            setSelectedTimeSlot(timeSlotOption)
                                            setOpenSelectTime(false)
                                          }
                                        }}
                                      >
                                        <div>{timeSlotOption?.label}</div>
                                      </div>
                                    )
                                  })}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="mt-4">
                          <div className="w-full relative">
                            <button
                              onClick={() => setOpenSelect(!openSelect)}
                              className="px-4 py-2 rounded-sm border w-full"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div>{selectedPrice?.title}</div>
                                </div>
                                <div className="flex items-center">
                                  <div>${selectedPrice?.price.toFixed(2)}</div>
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
                                {schedules &&
                                  schedules?.pricing
                                    ?.sort((a, b) => a.price - b.price)
                                    ?.map((pc) => {
                                      const isSelected =
                                        selectedPrice &&
                                        selectedPrice._id === pc._id
                                      return (
                                        <div
                                          key={pc?._id}
                                          className={`flex justify-between items-center p-2 cursor-pointer ${
                                            isSelected
                                              ? 'bg-sky-500 text-white'
                                              : 'hover:bg-sky-500 hover:text-white'
                                          }`}
                                          onClick={() => {
                                            setSelectedPrice(pc)
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

                          <div className=" pb-2 pt-2">
                            <button
                              onClick={handleBooking}
                              className="block w-full mt-4 bg-sky-500 text-white px-10 py-2 rounded-sm focus:outline-none focus:shadow-outline"
                              disabled={!selectedTimeSlot || !selectedPrice}
                            >
                              Book Now
                            </button>
                          </div>
                        </div>
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

export default ScheduleDetails
