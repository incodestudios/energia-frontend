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
import Resizer from 'react-image-file-resizer'

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
import { MdVerified } from 'react-icons/md'
import LocalSearch from '../../../components/forms/LocalSearch'
import {
  addCategory,
  getAdminCategories,
  updateCategoryFrontendByAdmin,
} from '../../../components/functions/categories'
import axios from 'axios'
import ImageUpload from '../../../components/forms/ImageUpload'
import Pagination from '../../../components/pagination/pagination'

const cancelIcon = require('../../../assets/cancel-icon.png')
const imagePreviewIcon = require('../../../assets/image-preview.png')

const AdminCategories = () => {
  const user = useSelector((state) => state.user)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()

  const {
    register: registerEdit,
    handleSubmit: handleSubmitEdit,
    formState: { errors: errorsEdit },
    reset: resetEdit,
    setValue: setValueEdit,
  } = useForm()

  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [data, setData] = useState([])
  const { activeMenu } = useStateContext()
  const [openTab, setOpenTab] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedDataEdit, setSelectedDataEdit] = useState(null)
  const [successModal, setSuccessModal] = useState('')
  const [errorModal, setErrorModal] = useState('')
  const [loadingModal, setLoadingModal] = useState(false)
  const [selectedImage, setSelectedImage] = useState(null)
  const [selectedPublicId, setSelectedPublicId] = useState(null)
  // Pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [dataPerPage] = useState(10)

  const getData = async () => {
    try {
      setLoading(true)
      const res = await getAdminCategories(user?.token, setError)
      if (res.status === 200) {
        setData(res?.data?.categories)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const searched = (keyword) => (c) => {
    const lowerCaseKeyword = keyword.toLowerCase()
    return (
      c?.name?.toLowerCase().includes(lowerCaseKeyword) ||
      c?.email?.toLowerCase().includes(lowerCaseKeyword)
    )
  }

  const dataSelect = (d) => {
    const dataFound = data?.find((dt) => dt._id === d)
    setSelectedDataEdit(dataFound)
    setSelectedImage(dataFound?.catImg)
    setSelectedPublicId(dataFound?.catImgPubId)
    setValueEdit('name', dataFound?.name)
    setShowEditModal(true)
  }

  const closeModal = () => {
    setErrorModal('')
    setSuccessModal('')
    setSelectedImage(null)
    setSelectedPublicId(null)
    setShowModal(false)
  }

  const closeEditModal = () => {
    setSelectedDataEdit(null)
    setErrorModal('')
    setSuccessModal('')
    setSelectedImage(null)
    setSelectedPublicId(null)
    setShowEditModal(false)
  }

  const onSubmit = async (formData) => {
    const dataToAdd = {
      name: formData.name,
      catImg: selectedImage,
      catImgPubId: selectedPublicId,
    }

    setErrorModal('')
    setSuccessModal('')

    try {
      setLoadingModal(true)
      const res = await addCategory(dataToAdd, user?.token, setErrorModal)
      if (res.status === 200) {
        setSuccessModal('Category added successfully')
        setTimeout(() => {
          setSuccessModal('')
          setErrorModal('')
          setSelectedImage(null)
          setSelectedPublicId(null)
          reset()
          getData()
          closeModal()
        }, 2000)
      }
      setLoadingModal(false)
    } catch (error) {
      setLoadingModal(false)
    }
  }

  const updateSchedule = async (e) => {
    e.preventDefault()
  }

  const updateCategory = async (formData) => {
    const dataToAdd = {
      name: formData.name,
      catImg: selectedImage,
      catImgPubId: selectedPublicId,
    }

    setErrorModal('')
    setSuccessModal('')

    try {
      setLoadingModal(true)
      const res = await updateCategoryFrontendByAdmin(
        dataToAdd,
        selectedDataEdit?.slug,
        user?.token,
        setErrorModal
      )
      if (res.status === 200) {
        setSuccessModal('Category updated successfully')
        setTimeout(() => {
          setSuccessModal('')
          setErrorModal('')
          setSelectedImage(null)
          setSelectedPublicId(null)
          getData()
          closeEditModal()
        }, 1000)
      }
      setLoadingModal(false)
    } catch (error) {
      setLoadingModal(false)
    }
  }

  //Get current posts
  const indexOfLastPost = currentPage * dataPerPage
  const indexOfFirstPost = indexOfLastPost - dataPerPage
  const currentData = data?.slice(indexOfFirstPost, indexOfLastPost)
  const howManyPages = Math?.ceil(data.length / dataPerPage)

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
            <h1 className="text-xl mb-4">Categories</h1>
            <button
              onClick={() => setShowModal(!showModal)}
              className="border-x-1 border-y-1 hover:bg-sky-400  py-2 px-4 sm:mb-0 bg-sky-500 text-white"
            >
              Add Category
            </button>

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
                  {showModal && (
                    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-gray-800 bg-opacity-50">
                      <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-1/2 pb-2 overflow-y-auto max-h-[100vh]">
                        <div className="bg-gray-100 border-b px-4 py-6 flex justify-between items-center rounded-lg">
                          <h3 className="font-semibold text-xl text-stone-600">
                            Add category
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

                          <form
                            onSubmit={handleSubmit(onSubmit)}
                            className="m-5"
                          >
                            <ImageUpload
                              selectedImage={selectedImage}
                              selectedPublicId={selectedPublicId}
                              setSelectedImage={setSelectedImage}
                              setSelectedPublicId={setSelectedPublicId}
                              setLoading={setLoadingModal}
                              user={user}
                            />

                            <div className="mb-4">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 my-2"
                              >
                                Category name
                              </label>
                              <input
                                id="name"
                                type="text"
                                {...register('name', {
                                  required: 'Category name is required',
                                })}
                                className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                                placeholder="Category name"
                              />
                              {errors.name && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errors.name.message}
                                </p>
                              )}
                            </div>

                            <div className="flex justify-start mt-10">
                              <button
                                className={`bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded mr-10 px-10 ${
                                  loadingModal && 'ActionButton'
                                }`}
                                type="submit"
                              >
                                Add category
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
                      <div className="bg-white rounded-lg shadow-lg w-full sm:w-4/5 md:w-1/2 pb-2">
                        <div className="bg-gray-100 border-b px-4 py-6 flex justify-between items-center rounded-lg">
                          <h3 className="font-semibold text-xl text-stone-600">
                            Update Category
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

                          <form
                            onSubmit={handleSubmitEdit(updateCategory)}
                            className="m-5"
                          >
                            <ImageUpload
                              selectedImage={selectedImage}
                              selectedPublicId={selectedPublicId}
                              setSelectedImage={setSelectedImage}
                              setSelectedPublicId={setSelectedPublicId}
                              setLoading={setLoadingModal}
                              user={user}
                            />

                            <div className="mb-4">
                              <label
                                htmlFor="name"
                                className="block text-sm font-medium text-gray-700 my-2"
                              >
                                Category name
                              </label>
                              <input
                                id="name"
                                type="text"
                                {...registerEdit('name', {
                                  required: 'Category name is required',
                                })}
                                className="block w-full py-1 px-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                                placeholder="Category name"
                              />
                              {errorsEdit.name && (
                                <p className="text-red-500 text-xs mt-1">
                                  {errorsEdit.name.message}
                                </p>
                              )}
                            </div>

                            <div className="flex justify-start mt-10">
                              <button
                                className={`bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded mr-10 px-10 ${
                                  loadingModal && 'ActionButton'
                                }`}
                                type="submit"
                              >
                                Update
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
                      {!loading && currentData && currentData?.length === 0 && (
                        <div className="text-center">
                          <p className="text-center my-3">No data found!</p>
                        </div>
                      )}
                      {currentData && currentData?.length > 0 && (
                        <table className="w-full">
                          <thead>
                            <tr className="bg-gray-200">
                              <th className="py-2 px-6 text-left">
                                Category Image
                              </th>
                              <th className="py-2 px-6 text-left">
                                Category name
                              </th>
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
                                          src={c?.catImg}
                                          alt="Client profile"
                                          className="w-20 h-16 rounded-md"
                                        />
                                      </div>
                                    </td>
                                    <td className="py-3 text-gray-500 text-left pl-3">
                                      {c?.name}
                                    </td>
                                    <td className="py-3 text-gray-500 text-left pl-3">
                                      <div className="text-gray-900 whitespace-no-wrap text-center flex justify-center items-center float-right">
                                        <span className="btn btn-sm float-right mx-2">
                                          <button
                                            onClick={() => dataSelect(c._id)}
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
                                            Edit category
                                          </ReactTooltip>
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                          </tbody>
                        </table>
                      )}

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
      </div>

      <Footer />
    </>
  )
}

export default AdminCategories
