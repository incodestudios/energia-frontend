import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import axios from 'axios'
import Cookies from 'js-cookie'
import { Link, NavLink, useNavigate, useParams } from 'react-router-dom'
import BarLoader from 'react-spinners/BarLoader'
import {
  CheckCircleFilled,
  ExclamationCircleOutlined,
  EyeOutlined,
  EyeInvisibleOutlined,
} from '@ant-design/icons'

import { useForm } from 'react-hook-form'
import animationData from '../../assets/loader.json'
import ErrorModal from '../../components/error/ErrorModal'
import { BiSolidErrorCircle, BiUserCheck } from 'react-icons/bi'
import { AiFillCheckCircle } from 'react-icons/ai'
import { checkUsernameRegister } from '../../components/functions/user'
import { updateClientCredentials } from '../../components/functions/client'
import { toast } from 'react-toastify'
import { Lottie } from '@crello/react-lottie'

const SetCredentialsPage = ({ userData }) => {
  const [usernameAvailable, setUsernameAvailable] = useState(true)
  const [usernameMsg, setUsernameMsg] = useState('')
  const {
    register,
    reset,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: userData?.name || '',
      email: userData?.email || '',
    },
  })
  const username = watch('username')
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [showError, setShowError] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [showConPassword, setShowConPassword] = useState(false)

  const checkUsername = useCallback(async () => {
    try {
      const response = await checkUsernameRegister(username, setUsernameMsg)
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
    if (username?.length >= 4) {
      checkUsername()
    } else {
      setUsernameAvailable(true)
    }
  }, [username])

  const onSubmit = async (data) => {
    const { username, password, conPassword } = data

    if (password !== conPassword) {
      toast.error('Password does not match')
      return
    }

    const sendData = {
      username,
      password,
    }

    const uId = userData?._id

    try {
      setLoading(true)
      const response = await updateClientCredentials(uId, sendData, setError)
      if (response && response?.status === 200) {
        setSuccess(response?.data?.message)
        setError('')
        setTimeout(() => {
          setSuccess('')
          reset()
          navigate('/login')
        }, 3000)
      }
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="grid h-screen place-items-center">
      <div className="w-full p-6 m-auto  rounded-md shadow-sm shadow-sky-300 sm:max-w-xl lg:max-w-xl">
        <div className="relative w-full my-5">
          <div className="flex justify-center items-center h-1 absolute w-full mb-6">
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

        <section className="hero container max-w-screen-lg mx-auto py-4">
          {/* <img
            className="mx-auto"
            alt="branding logo"
            src="logo.png"
            style={{
              width: '150px',
            }}
          /> */}

          <p className="text-xl text-center pt-4">Energis</p>
        </section>

        <h1 className="text-md font-semibold text-left my-2">
          Setup your account with credentials.
        </h1>

        <div>
          {showError && (
            <ErrorModal
              message="Invalid or expired token."
              onClose={() => setShowError(false)}
            />
          )}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                {...register('name')}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Name"
                value={userData.name} // Display the default value from userData
                readOnly // Make the input read-only
                disabled // Disable the input field
                style={{ backgroundColor: '#eee' }} // Set the background color to gray
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                {...register('email')}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={userData.email}
                readOnly
                disabled
                style={{ backgroundColor: '#eee' }}
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="username"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                {...register('username', {
                  required: true,
                  minLength: 4,
                  pattern: {
                    value: /^[a-z]+$/,
                  },
                })}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Username"
              />

              {errors.username?.type === 'minLength' && (
                <p className="text-red-500 text-xs mt-1">
                  Username must be at least 4 characters long
                </p>
              )}

              {username?.length >= 4 &&
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

              {errors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <div className="password_2 block relative">
                <input
                  {...register('password', {
                    required: 'Password is required',
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="password"
                  placeholder="Password"
                />
                <div
                  className="icon_button absolute right-4"
                  style={{
                    top: '5px',
                  }}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs py-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="conPassword"
              >
                Password
              </label>
              <div className="password_2 block relative">
                <input
                  {...register('conPassword', {
                    required: 'Confirm password is required',
                  })}
                  type={showConPassword ? 'text' : 'password'}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="conPassword"
                  placeholder="Confirm password"
                />
                <div
                  className="icon_button absolute right-4"
                  style={{
                    top: '5px',
                  }}
                  onClick={() => setShowConPassword(!showConPassword)}
                >
                  {showConPassword ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                </div>
              </div>
              {errors.conPassword && (
                <p className="text-red-500 text-xs py-2">
                  {errors.conPassword.message}
                </p>
              )}
            </div>

            <div className="flex justify-start mt-10">
              <button
                type="submit"
                className={`bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded mr-10 px-10 ${
                  loading && 'ActionButton'
                }`}
              >
                Complete setup
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SetCredentialsPage
