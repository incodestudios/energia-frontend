import { useDispatch, useSelector } from 'react-redux'
import { Link, NavLink } from 'react-router-dom'
import { BsEnvelope, BsPlayBtn } from 'react-icons/bs'
import Cookies from 'js-cookie'
import {
  CheckCircleFilled,
  DeleteOutlined,
  EditOutlined,
  ExclamationCircleOutlined,
  LinkOutlined,
  VerifiedOutlined,
} from '@ant-design/icons'
import { useStateContext } from '../../../components/contexts/ContextProvider'
import UserSidebar from '../../../components/sidebar/UserSidebar'
import Navbar from '../../../components/nav/Navbar'
import HeaderProfile from '../../../components/HeaderProfile'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineUser } from 'react-icons/ai'
import { BiEdit, BiUserCheck } from 'react-icons/bi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { ImUserCheck, ImUserMinus } from 'react-icons/im'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import Select from 'react-dropdown-select'

import {
  getClientsNextPaymentDateFront,
  sendPaymentReminderFront,
  updateUserData,
  updateUserPassword,
} from '../../../components/functions/user'
import { Lottie } from '@crello/react-lottie'
import animationData from '../../../assets/loader.json'
import { toast } from 'react-toastify'
import WebNavBar from '../../../components/nav/WebNavBar'
import Footer from '../../../components/footer/Footer'
import { BarLoader, PulseLoader } from 'react-spinners'
import {
  getClientsTrainer,
  getScheduleTrainer,
  resendLinkRegFrontClient,
  updateClientSchedule,
} from '../../../components/functions/client'
import { MdVerified } from 'react-icons/md'
import LocalSearch from '../../../components/forms/LocalSearch'
import Pagination from '../../../components/pagination/pagination'

const cancelIcon = require('../../../assets/cancel-icon.png')

const NextPayment = () => {
  const divRef = useRef()
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [data, setData] = useState([])
  const { activeMenu } = useStateContext()
  const [openTab, setOpenTab] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedClientEdit, setSelectedClientEdit] = useState(null)
  const [successModal, setSuccessModal] = useState('')
  const [errorModal, setErrorModal] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)
  const [schedules, setSchedules] = useState([])
  const [scheduleValues, setScheduleValues] = useState([])
  const [selectedClientSchedules, setSelectedClientSchedules] = useState([])
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [dataPerPage] = useState(10)

  const getData = async () => {
    try {
      setLoading(true)
      const res = await getClientsNextPaymentDateFront(user?.token, setError)
      if (res.status === 200) {
        setData(res?.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  //Get current posts
  const indexOfLastPost = currentPage * dataPerPage
  const indexOfFirstPost = indexOfLastPost - dataPerPage
  const currentData = data?.slice(indexOfFirstPost, indexOfLastPost)
  const howManyPages = Math?.ceil(data.length / dataPerPage)

  const searched = (keyword) => (c) => {
    const lowerCaseKeyword = keyword.toLowerCase()
    return (
      c?.name?.toLowerCase().includes(lowerCaseKeyword) ||
      c?.email?.toLowerCase().includes(lowerCaseKeyword)
    )
  }

  const sendPaymentReminder = async (name, email, date) => {
    const formattedDate = new Date(date).toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })

    const newData = {
      name,
      email,
      date: formattedDate,
    }

    setError('')
    setSuccess('')

    try {
      setLoading(true)
      const res = await sendPaymentReminderFront(newData, user?.token, setError)

      if (res && res.status === 200) {
        setSuccess(res.data.message)
        setTimeout(() => {
          setSuccess('')
          setError('')
        }, 2000)
      }

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
            <h1 className="text-xl mb-4">Next payment clients</h1>
            <Link
              to="/clients/add-client"
              as={NavLink}
              className="border-x-1 border-y-1 hover:bg-sky-400  py-2 px-4 sm:mb-0 bg-sky-500 text-white"
            >
              Add client
            </Link>

            <div className="m-4 md:ml-0 mt-2 p-0 md:p-0 bg-white">
              <div className="overflow-x-auto">
                <div className="pt-4">
                  {!loading && currentData && currentData?.length > 0 && (
                    <LocalSearch keyword={keyword} setKeyword={setKeyword} />
                  )}
                </div>
                <div className="flex items-center justify-center h-[10px] mt-2">
                  {loading && (
                    <BarLoader color="#0FBCF9" loading={loading} size={20} />
                  )}
                </div>

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

                <div className="-mx-4 sm:-mx-8 sm:px-8 py-4 overflow-x-auto">
                  <div className="pb-3 bg-white">
                    <div className="space-y-1 overflow-x-auto">
                      {!loading && currentData && currentData?.length === 0 && (
                        <div className="text-center">
                          <p className="text-center my-3">No data found!</p>
                        </div>
                      )}
                      {currentData && currentData?.length > 0 && (
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="py-2 px-6 text-left">NAME</th>
                              <th className="py-2 px-6 text-left">EMAIL</th>
                              <th className="py-2 px-6 text-right">
                                ACTION/STATUS
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {currentData &&
                              currentData
                                ?.filter(searched(keyword))
                                ?.map((c) => (
                                  <tr key={c._id}>
                                    <td className="py-3 text-gray-500 text-left pl-3">
                                      <div className="ml-3 flex justify-start items-center">
                                        <img
                                          src={c?.profile_image_link}
                                          alt="Client profile"
                                          className="w-6 h-6 rounded-full"
                                        />
                                        <p className="text-gray-900 whitespace-no-wrap ml-2">
                                          {c?.name}
                                        </p>
                                      </div>
                                    </td>
                                    <td className="py-3 text-gray-500 text-left pl-3">
                                      {c?.email}
                                    </td>
                                    <td className="py-3 text-gray-500 text-left pl-3">
                                      <div className="text-gray-900 whitespace-no-wrap text-center flex justify-center items-center float-right">
                                        <span className="btn btn-sm float-right mx-2"></span>
                                        <button
                                          onClick={() =>
                                            sendPaymentReminder(
                                              c?.name,
                                              c?.email,
                                              c?.nextPayment
                                            )
                                          }
                                          className="bg-sky-500 text-white rounded-sm px-4"
                                          disabled={loading}
                                        >
                                          {loading ? (
                                            <PulseLoader
                                              color="#fff"
                                              loading={loading}
                                              size={7}
                                            />
                                          ) : (
                                            'Send alert'
                                          )}
                                        </button>
                                        <span className="btn btn-sm float-right mx-2">
                                          {c?.verified ? (
                                            <ImUserCheck
                                              className="text-sky-500 "
                                              data-tooltip-id={`userTooltip-${c._id}`}
                                            />
                                          ) : (
                                            <ImUserMinus
                                              className="text-red-500"
                                              data-tooltip-id={`userTooltip-${c._id}`}
                                            />
                                          )}
                                        </span>
                                        <ReactTooltip
                                          id={`userTooltip-${c._id}`}
                                          place="top"
                                          effect="solid"
                                        >
                                          {c?.verified
                                            ? 'Client Verified'
                                            : 'Client Not Verified'}
                                        </ReactTooltip>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      )}
                    </div>

                    {!loading && currentData && currentData?.length > 0 && (
                      <div className="py-20">
                        <Pagination
                          pages={howManyPages}
                          setCurrentPage={setCurrentPage}
                        />
                      </div>
                    )}
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

export default NextPayment
