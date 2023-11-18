import React, { useEffect, useState } from 'react'
import Footer from '../../components/footer/Footer'
import { Link, useParams } from 'react-router-dom'
import { getTrainerAndSchedule } from '../../components/functions/user'
import WebNavBar from '../../components/nav/WebNavBar'
import { Lottie } from '@crello/react-lottie'
import animationData from '../../assets/loader.json'
import moment from 'moment'
import {
  MdArrowBackIos,
  MdArrowBackIosNew,
  MdArrowForwardIos,
} from 'react-icons/md'

const PublicProfile = () => {
  const { username } = useParams()
  const [data, setData] = useState([])
  const [schedules, setSchedules] = useState([])
  const [loading, setLoading] = useState(false)
  const [scheduleLoading, setScheduleLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [currentWeek, setCurrentWeek] = useState(moment().startOf('week'))
  const [selectedDate, setSelectedDate] = useState(moment().startOf('day'))
  const [clickableDates, setClickableDates] = useState([])

  const weeksToShow = 3

  const getTrainer = async () => {
    try {
      setLoading(true)
      const res = await getTrainerAndSchedule(username, setError)
      if (res && res.status === 200) {
        setData(res.data.user)
        setSchedules(res.data.schedules)

        const scheduleDates = res.data.schedules.flatMap((schedule) => {
          const startDate = moment(schedule.start)
          const endDate = moment(schedule.end)
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
    setScheduleLoading(true) // Set scheduleLoading to true

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

    // Clear scheduleLoading after 2 seconds
    setTimeout(() => {
      setScheduleLoading(false)
    }, 2000)
  }

  const handleDateClick = (date) => {
    setScheduleLoading(true)

    setSelectedDate(date.startOf('day'))

    setTimeout(() => {
      setScheduleLoading(false)
    }, 2000)
  }

  const renderDateColumns = () => {
    const dateColumns = []

    for (let i = 0; i < 7; i++) {
      const currentDate = moment(currentWeek).startOf('week').add(i, 'days')
      const isToday = currentDate.isSame(moment().startOf('day'), 'day')
      const isSelected = selectedDate.isSame(currentDate, 'day')
      const isPastDate = currentDate.isBefore(moment().startOf('day'), 'day')
      const isClickable = clickableDates.includes(
        currentDate.format('YYYY-MM-DD')
      )

      dateColumns.push(
        <div
          key={i}
          className={`text-center cursor-pointer ${
            isSelected
              ? 'font-bold text-sky-500'
              : isToday
              ? 'text-blue-600'
              : isPastDate
              ? 'text-gray-400 cursor-not-allowed'
              : isClickable
              ? 'text-black'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          onClick={() => (isClickable ? handleDateClick(currentDate) : null)}
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

                              const scheduleItems = schedules.map(
                                (schedule, index, array) => {
                                  const isLastItem = index === array.length - 1
                                  const isScheduleOnSelectedDate =
                                    moment(selectedDate).isBetween(
                                      moment(schedule.start),
                                      moment(schedule.end),
                                      undefined,
                                      '[]'
                                    ) ||
                                    moment(selectedDate).isSame(
                                      moment(schedule.start),
                                      'day'
                                    ) ||
                                    moment(selectedDate).isSame(
                                      moment(schedule.end),
                                      'day'
                                    )

                                  if (isScheduleOnSelectedDate) {
                                    hasSchedulesForSelectedDate = true

                                    return (
                                      <div
                                        key={schedule._id}
                                        className={`mb-4 w-full flex flex-col md:flex-row justify-between items-center border-b ${
                                          isLastItem
                                            ? 'border-none pb-4'
                                            : 'border-gray-200 pb-4'
                                        }`}
                                      >
                                        <div className="flex w-full md:w-1/2 justify-start items-center border-r-0 md:border-r">
                                          <img
                                            src={schedule?.category?.catImg}
                                            alt="Category"
                                            className="w-52 h-32 rounded-sm"
                                          />
                                          <div className="mx-4">
                                            <p className="text-md">
                                              {schedule?.category?.name}
                                            </p>
                                            <p className="text-lg font-bold">
                                              {schedule?.title}
                                            </p>
                                            <p className="text-md">
                                              {schedule?.location}
                                            </p>
                                          </div>
                                        </div>

                                        <div className="flex w-full md:w-1/2 justify-between items-center ml-4 my-4 md:my-0">
                                          <div>
                                            <p className="text-xl text-sky-500 font-bold">
                                              <span className="text-slate-600 w-16 inline-block">
                                                Start:
                                              </span>
                                              {moment(schedule.start).format(
                                                'h:mm A'
                                              )}
                                            </p>
                                            <p className="text-xl text-slate-500">
                                              <span className="text-slate-600 w-16 inline-block">
                                                End:
                                              </span>
                                              {moment(schedule.end).format(
                                                'h:mm A'
                                              )}
                                            </p>
                                          </div>

                                          <div className="ml-4 flex justify-center items-center">
                                            {schedule?.pricing
                                              .sort((a, b) => a.price - b.price)
                                              .slice(0, 1)
                                              .map((p) => (
                                                <p
                                                  className="text-2xl"
                                                  key={p?._id}
                                                >
                                                  ${p?.price.toFixed(2)}
                                                </p>
                                              ))}

                                            <Link
                                              to=""
                                              className="bg-sky-500 text-white px-10 py-2 ml-3"
                                            >
                                              BOOK
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  }

                                  return null
                                }
                              )

                              if (
                                schedules.length === 0 ||
                                !hasSchedulesForSelectedDate
                              ) {
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
