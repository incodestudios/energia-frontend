import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { BsEnvelope, BsPlayBtn } from 'react-icons/bs'
import Cookies from 'js-cookie'
import {
  CheckCircleFilled,
  ExclamationCircleOutlined,
  LinkOutlined,
} from '@ant-design/icons'
import { useStateContext } from '../../../components/contexts/ContextProvider'
import UserSidebar from '../../../components/sidebar/UserSidebar'
import Navbar from '../../../components/nav/Navbar'
import HeaderProfile from '../../../components/HeaderProfile'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { AiOutlineUser } from 'react-icons/ai'
import { BiUserCheck } from 'react-icons/bi'
import { RiLockPasswordLine } from 'react-icons/ri'
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
import axios from 'axios'
const imagePreviewIcon = require('../../../assets/image-preview.png')

const Settings = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const { activeMenu } = useStateContext()
  const [openTab, setOpenTab] = useState(1)
  const [selectedImage, setSelectedImage] = useState(user?.img)
  const [selectedPublicId, setSelectedPublicId] = useState(user?.public_id)
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: user,
  })

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
    watch: watchPassword,
    reset: resetPassword,
  } = useForm()

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleImageUpload(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]

    handleImageUpload(file)
  }

  const handleImageUpload = (file) => {
    if (selectedImage) {
      return toast.error('You can only upload one image at a time')
    }

    if (file.size / 1024 > 5120) {
      return toast.error('File size should be less than 5MB')
    }

    setLoading(true)

    Resizer.imageFileResizer(
      file,
      720,
      720,
      'JPEG',
      100,
      0,
      async (uri) => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}${'upload-image'}`,
            { image: uri },
            {
              headers: {
                Authorization: user ? `Bearer ${user?.token}` : '',
              },
            }
          )

          setLoading(false)

          setSelectedImage(response?.data?.url)
          setSelectedPublicId(response?.data?.public_id)
        } catch (error) {
          setLoading(false)
          console.log('CLOUDINARY UPLOAD ERR', error)
        }
      },
      'base64'
    )
  }

  const handleImageRemove = (public_id) => {
    if (!public_id) {
      setSelectedImage(null)
      return
    }

    setLoading(true)
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}${'remove-image'}`,
        { public_id },
        {
          headers: {
            Authorization: user ? `Bearer ${user.token}` : '',
          },
        }
      )
      .then((res) => {
        setLoading(false)

        if (res.status === 200) {
          setSelectedImage(null)
          setSelectedPublicId(null)
        }
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  const onSubmit = async (formData) => {
    if (!selectedImage) {
      return toast.error('Please upload your profile image')
    }

    const { name } = formData

    const sendData = {
      name,
      profile_image_link: selectedImage,
      profile_img_public_id: selectedPublicId,
    }

    setError('')
    setSuccess('')
    try {
      setLoading(true)
      const response = await updateUserData(sendData, user?.token, setError)
      setSuccess(response.data.message)
      setTimeout(() => {
        setSuccess('')
        setError('')
      }, 2000)

      dispatch({
        type: 'LOGIN',
        payload: {
          ...user,
          name: response.data.userData.name,
          img: response.data.userData.profile_image_link,
          public_id: response.data.userData.profile_img_public_id,
        },
      })

      Cookies.set(
        'user',
        JSON.stringify({
          ...user,
          name: response.data.userData.name,
          img: response.data.userData.profile_image_link,
          public_id: response.data.userData.profile_img_public_id,
        }),
        { expires: 30 }
      )

      setLoading(false)
    } catch (err) {
      setLoading(false)
      setSuccess('')
    }
  }

  const handleUpdatePassword = async (passwordData) => {
    const { currentPassword, newPassword, confirmPassword } = passwordData

    if (newPassword !== confirmPassword) {
      toast.error('Password does not match')
      return
    }

    let sendData = {
      cpassword: currentPassword,
      password: newPassword,
    }

    setError('')
    setSuccess('')
    try {
      setLoading(true)
      const response = await updateUserPassword(sendData, user?.token, setError)
      setSuccess(response.data.message)
      setTimeout(() => {
        setSuccess('')
        setError('')

        resetPassword()
      }, 2000)
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
          <div>
            <div className="m-2 md:m-10 p-2 md:p-5 bg-white rounded-1xl">
              <HeaderProfile title="Settings" />
              <div className="flex flex-col items-start justify-start">
                <ul className="flex text-sm font-medium">
                  <li>
                    <div
                      onClick={() => setOpenTab(1)}
                      className={`-mb-px border-b-4 border-current pb-2 mr-3 ${
                        openTab === 1 ? 'text-blue-500' : 'text-gray-500'
                      }  cursor-pointer`}
                    >
                      General Information
                    </div>
                  </li>
                  <li>
                    <div
                      onClick={() => setOpenTab(2)}
                      className={`-mb-px border-b-4 border-current pb-2 mr-3 ${
                        openTab === 2 ? 'text-blue-500' : 'text-gray-500'
                      }  cursor-pointer`}
                    >
                      Password
                    </div>
                  </li>
                </ul>
                <div className="pb-3 mt-6 md:w-4/5 lg:w-3/4 w-full">
                  <div className={openTab === 1 ? 'block' : 'hidden'}>
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

                    <form onSubmit={handleSubmit(onSubmit)} className="pt-8">
                      {selectedImage && (
                        <div
                          style={{
                            position: 'relative',
                            display: 'inline-block',
                          }}
                        >
                          <div
                            onClick={() =>
                              handleImageRemove(
                                selectedPublicId ? selectedPublicId : null
                              )
                            }
                            className="custom_image_remove_icon"
                          >
                            X
                          </div>
                          <img
                            src={selectedImage}
                            alt="Profile"
                            style={{
                              width: '200px',
                              height: '200px',
                              objectFit: 'cover',
                              marginBottom: '10px',
                            }}
                          />
                        </div>
                      )}

                      {!selectedImage && (
                        <div
                          className="border border-sky-500 rounded h-48 w-60 flex flex-col items-center justify-center mb-6"
                          onDrop={handleDrop}
                          onDragOver={handleDragOver}
                        >
                          <div className="mb-2 mt-2">
                            <img
                              src={imagePreviewIcon}
                              alt="Preview"
                              className="h-16 w-16 object-contain mt-3"
                            />
                          </div>
                          <div>Drag image here</div>
                          <label
                            htmlFor="image-upload"
                            className="text-sky-500 text-xs mt-1 mb-4 cursor-pointer"
                          >
                            Browse image
                            <input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={handleFileUpload}
                            />
                          </label>
                        </div>
                      )}

                      <div className="mb-4">
                        <div className="w-full inline-flex bg-stone-100">
                          <div className="w-1/12 flex justify-center items-center border-r border-red-50">
                            <AiOutlineUser size={25} />
                          </div>
                          <input
                            id="name"
                            type="text"
                            {...register('name', {
                              required: 'Name is required',
                            })}
                            className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                            placeholder="Your name"
                          />
                        </div>

                        {errors.name && (
                          <p className="text-red-500 text-xs mt-1">
                            {errors.name.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="w-full inline-flex bg-stone-100">
                          <div className="w-1/12 flex justify-center items-center border-r bg-stone-200 border-r-stone-300">
                            <BiUserCheck size={25} />
                          </div>

                          <input
                            id="username"
                            type="text"
                            {...register('username')}
                            className="block w-full p-2 text-lg rounded-sm bg-stone-200 border border-stone-200  outline-none"
                            placeholder="Username"
                            disabled
                          />
                        </div>

                        <p className="text-stone-500 text-xs mt-1">
                          Username can't be changed
                        </p>
                      </div>

                      <div className="mb-4">
                        <div className="w-full inline-flex bg-stone-100">
                          <div className="w-1/12 flex justify-center items-center border-r bg-stone-200 border-r-stone-300">
                            <BsEnvelope size={25} />
                          </div>
                          <input
                            id="email"
                            type="text"
                            {...register('email')}
                            className="block w-full p-2 text-lg rounded-sm bg-stone-200 border border-stone-200  outline-none"
                            placeholder="Email address"
                            disabled
                          />
                        </div>

                        <p className="text-stone-500 text-xs mt-1">
                          Email can't be changed
                        </p>
                      </div>

                      <div className="px-2 pb-2 pt-2">
                        <button
                          className={`block w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded mr-10 px-10 ${
                            loading && 'ActionButton'
                          }`}
                          type="submit"
                        >
                          Update
                        </button>
                      </div>
                    </form>
                  </div>
                  <div className={openTab === 2 ? 'block' : 'hidden'}>
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

                    <form
                      onSubmit={handleSubmitPassword(handleUpdatePassword)}
                      className="pt-8"
                    >
                      <div className="mb-4">
                        <div className="w-full inline-flex bg-stone-100">
                          <div className="w-1/12 flex justify-center items-center border-r bg-stone-200 border-r-stone-300">
                            <RiLockPasswordLine size={25} />
                          </div>

                          <input
                            id="currentPassword"
                            type="password"
                            {...registerPassword('currentPassword', {
                              required: 'Current password is required',
                            })}
                            className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                            placeholder="Current password"
                          />
                        </div>

                        {errorsPassword.currentPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {errorsPassword.currentPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="w-full inline-flex bg-stone-100">
                          <div className="w-1/12 flex justify-center items-center border-r bg-stone-200 border-r-stone-300">
                            <RiLockPasswordLine size={25} />
                          </div>

                          <input
                            id="newPassword"
                            type="password"
                            {...registerPassword('newPassword', {
                              required: 'New password is required',
                            })}
                            className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                            placeholder="New password"
                          />
                        </div>

                        {errorsPassword.newPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {errorsPassword.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="mb-4">
                        <div className="w-full inline-flex bg-stone-100">
                          <div className="w-1/12 flex justify-center items-center border-r bg-stone-200 border-r-stone-300">
                            <RiLockPasswordLine size={25} />
                          </div>

                          <input
                            id="confirmPassword"
                            type="password"
                            {...registerPassword('confirmPassword', {
                              required: 'Confirm new password is required',
                            })}
                            className="block w-full p-2 text-lg rounded-sm bg-white border border-stone-200  outline-none"
                            placeholder="Confirm new password"
                          />
                        </div>

                        {errorsPassword.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1">
                            {errorsPassword.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <div className="px-2 pb-2 pt-2">
                        <button className="uppercase block w-full p-2 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none text-white">
                          Create new password
                        </button>
                      </div>
                    </form>
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

export default Settings
