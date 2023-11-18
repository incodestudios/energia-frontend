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
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineUser } from 'react-icons/ai'
import { BiEdit, BiUserCheck } from 'react-icons/bi'
import { RiLockPasswordLine } from 'react-icons/ri'
import { ImUserCheck, ImUserMinus } from 'react-icons/im'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import 'react-tooltip/dist/react-tooltip.css'
import Select from 'react-dropdown-select'

import {
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

const Clients = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [clients, setClients] = useState([])
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

  const getClients = async () => {
    try {
      setLoading(true)
      const res = await getClientsTrainer(user?.token, setError)
      if (res.status === 200) {
        setClients(res?.data?.clientsData)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getClients()
  }, [])

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

  const resendLink = async (name, email) => {
    const newData = {
      trainer: user?.id,
      name,
      email,
    }
    setError('')
    setSuccess('')

    try {
      setLoading(true)
      const res = await resendLinkRegFrontClient(newData, user?.token, setError)

      if (res && res.status === 200) {
        setSuccess(res.data.message)
        setTimeout(() => {
          setSuccess('')
          setError('')
          window.location.reload()
        }, 2000)
      }

      setLoading(false)
    } catch (err) {
      setLoading(false)
      setSuccess('')
    }
  }

  const searched = (keyword) => (c) => {
    const lowerCaseKeyword = keyword.toLowerCase()
    return (
      c?.name?.toLowerCase().includes(lowerCaseKeyword) ||
      c?.email?.toLowerCase().includes(lowerCaseKeyword)
    )
  }

  const clientSelect = (c) => {
    const chFound = clients?.find((cl) => cl._id === c)
    setSelectedClientEdit(chFound)

    const clientSchedules = schedules.filter((schedule) =>
      chFound.schedules?.includes(schedule._id)
    )
    setSelectedClientSchedules(clientSchedules)
    setScheduleValues(clientSchedules)
    setShowEditModal(true)
  }

  const closeEditModal = () => {
    setSelectedClientEdit(null)
    setScheduleValues(null)
    setErrorModal('')
    setSuccessModal('')
    setShowEditModal(false)
  }

  const updateSchedule = async (e) => {
    e.preventDefault()
    const newData = {
      clientId: selectedClientEdit?._id,
      schedules: scheduleValues,
    }

    setErrorModal('')
    setSuccessModal('')

    try {
      setLoadingModal(true)
      const res = await updateClientSchedule(
        newData,
        user?.token,
        setErrorModal
      )
      if (res.status === 200) {
        setSuccessModal('Client schedule updated successfully')
        setTimeout(() => {
          setSuccessModal('')
          setErrorModal('')
          getSchedule()
          getClients()
          closeEditModal()
        }, 2000)
      }
      setLoadingModal(false)
    } catch (error) {
      setLoadingModal(false)
    }
  }

  //Get current posts
  const indexOfLastPost = currentPage * dataPerPage
  const indexOfFirstPost = indexOfLastPost - dataPerPage
  const currentData = clients?.slice(indexOfFirstPost, indexOfLastPost)
  const howManyPages = Math?.ceil(clients.length / dataPerPage)

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
            <h1 className="text-xl mb-4">Clients</h1>
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
                  <LocalSearch keyword={keyword} setKeyword={setKeyword} />
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
                  {showEditModal && (
                    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
                      <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-1/2 pb-2">
                        <div className="bg-gray-100 border-b px-4 py-6 flex justify-between items-center rounded-lg">
                          <h3 className="font-semibold text-xl text-stone-600">
                            Update client schedule
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

                          <form className="m-5" onSubmit={updateSchedule}>
                            <div className="mb-4">
                              <label className="text-slate-600">
                                Schedules
                              </label>
                              <Select
                                name="select"
                                options={schedules}
                                labelField="title"
                                valueField="_id"
                                multi
                                onChange={(value) => setScheduleValues(value)}
                                color="#5ac8fa"
                                values={selectedClientSchedules}
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

                  <div className="pb-3 bg-white">
                    <div className="space-y-1 overflow-x-auto">
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
                            currentData?.filter(searched(keyword))?.map((c) => (
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
                                    <span className="btn btn-sm float-right mx-2">
                                      <button
                                        onClick={() => clientSelect(c._id)}
                                      >
                                        <BiEdit
                                          className="text-sky-500"
                                          data-tooltip-id={`userEditTooltip-${c._id}`}
                                        />
                                      </button>
                                      <ReactTooltip
                                        id={`userEditTooltip-${c._id}`}
                                        place="top"
                                        effect="solid"
                                      >
                                        Edit client schedule
                                      </ReactTooltip>
                                    </span>
                                    <span className="btn btn-sm float-right mx-2">
                                      {c?.verified ? (
                                        <ImUserCheck
                                          className="text-sky-500"
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
                                    {!c.verified && (
                                      <button
                                        onClick={() =>
                                          resendLink(c.name, c.email)
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
                                          'Resend'
                                        )}
                                      </button>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="py-20">
                      <Pagination
                        pages={howManyPages}
                        setCurrentPage={setCurrentPage}
                      />
                    </div>
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

export default Clients
