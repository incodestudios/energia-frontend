import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { RiLockPasswordLine } from 'react-icons/ri'
import { Lottie } from '@crello/react-lottie'
import animationData from '../../assets/loader.json'
import Typed from 'react-typed'
import {
  loginUser,
  emailRequestForget,
  forgetPasswordCodeCheck,
  forgetPasswordUpdateRequest,
} from '../../components/functions/user'
import { CheckCircleFilled, ExclamationCircleOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import { BiUserCheck } from 'react-icons/bi'
import { toast } from 'react-toastify'

const codeInputs = Array(6).fill('')
let newInputCodeIndex = 0

const Login = () => {
  const inputCodeRef = useRef()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [step, setStep] = useState(1)
  const [otp, setOtp] = useState({ 0: '', 1: '', 2: '', 3: '', 4: '', 5: '' })
  const [nextInputCodeIndex, setNextInputCodeIndex] = useState(0)

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
  } = useForm()

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: errorsPassword },
  } = useForm()

  const emailOrUsrForget = watchEmail('identifierUsrOrEmail')

  const onSubmit = async (formData) => {
    const { identifier, password } = formData

    const sendData = {
      identifier,
      password,
    }

    setError('')
    setSuccess('')
    try {
      setLoading(true)
      const response = await loginUser(sendData, setError)
      setSuccess(response.data.message)
      setTimeout(() => {
        setSuccess('')
        setError('')
        reset()
        dispatch({ type: 'LOGIN', payload: response?.data?.userData })
        Cookies.set('user', JSON.stringify(response?.data?.userData), {
          expires: 30,
        })

        // response?.data?.userData?.role === 'admin'
        //       ? navigate('/admin/dashboard')
        //       : navigate('/dashboard')

        response?.data?.role === 'admin' ? navigate('/') : navigate('/')
      }, 2000)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setSuccess('')
    }
  }

  const emailSubmit = async (emailData) => {
    const { identifierUsrOrEmail } = emailData

    const sendData = {
      identifierUsrOrEmail,
    }

    setError('')
    setSuccess('')
    try {
      setLoading(true)
      const response = await emailRequestForget(sendData, setError)
      setSuccess(response.data.message)
      setTimeout(() => {
        setSuccess('')
        setError('')
        setStep(3)
      }, 2000)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setSuccess('')
    }
  }

  const handleVerification = async (e) => {
    e.preventDefault()
    let val = ''
    Object.values(otp).forEach((v) => {
      val += v
    })
    setLoading(true)
    if (val.length < 6) {
      toast.error('Please fill all code fields')
      setLoading(false)
    } else {
      if (isObjValid(otp)) {
        let val = ''
        Object.values(otp).forEach((v) => {
          val += v
        })

        if (!val) {
          alert('Please enter the code')
          setLoading(false)
          return
        }

        let sendData = {
          emailOrUsrForget,
          vcode: val,
        }

        try {
          setLoading(true)
          const response = await forgetPasswordCodeCheck(sendData, setError)
          setSuccess(response.data.message)
          setTimeout(() => {
            setSuccess('')
            setError('')
            setStep(4)
          }, 2000)
          setLoading(false)
        } catch (err) {
          setLoading(false)
          setSuccess('')
        }
      }
    }
  }

  const handleUpdatePassword = async (passwordData) => {
    const { newPassword } = passwordData

    let val = ''
    Object.values(otp).forEach((v) => {
      val += v
    })
    if (val.length < 6) {
      toast.error('Please fill all code fields')
      setLoading(false)
    } else {
      if (isObjValid(otp)) {
        let val = ''
        Object.values(otp).forEach((v) => {
          val += v
        })

        if (!val) {
          alert('Please enter the code')
          setLoading(false)
          return
        }

        let sendData = {
          emailOrUsrForget,
          password: newPassword,
          vcode: val,
        }

        setError('')
        setSuccess('')
        try {
          setLoading(true)
          const response = await forgetPasswordUpdateRequest(sendData, setError)
          setSuccess(response.data.message)
          setTimeout(() => {
            setSuccess('')
            setError('')
            setStep(1)
          }, 2000)
          setLoading(false)
        } catch (err) {
          setLoading(false)
          setSuccess('')
        }
      }
    }
  }

  const handleSteps = () => {
    switch (step) {
      case 1:
        return (
          <>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-16">
              <div className="my-6">
                <div className="w-full inline-flex bg-gray-600">
                  <div className="w-1/12 flex justify-center items-center ">
                    <BiUserCheck size={25} />
                  </div>
                  <input
                    id="identifier"
                    type="text"
                    {...register('identifier', {
                      required: 'Email or username is required',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-black focus:border-gray-500 outline-none"
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
                <div className="w-full inline-flex bg-gray-600">
                  <div className="w-1/12 flex justify-center items-center ">
                    <RiLockPasswordLine size={25} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-black focus:border-gray-500 outline-none"
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
                <button onClick={() => setStep(2)} className="mb-2">
                  Forgot password?
                </button>
              </div>

              <div className="px-2 pb-2 pt-2">
                <button className="uppercase block w-full p-2 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none">
                  Login
                </button>
              </div>
            </form>

            <h6 className="text-center text-muted my-4 ">
              Don't have an account?{' '}
              <Link
                to="/register"
                as={NavLink}
                className="text-sm  hover:underline  hover:text-green-600"
              >
                Register
              </Link>
            </h6>
          </>
        )

      case 2:
        return (
          <>
            <form onSubmit={handleSubmitEmail(emailSubmit)} className="mt-16">
              <div className="my-6">
                <div className="w-full inline-flex bg-gray-600">
                  <div className="w-1/12 flex justify-center items-center ">
                    <BiUserCheck size={25} />
                  </div>
                  <input
                    id="identifierUsrOrEmail"
                    type="text"
                    {...registerForget('identifierUsrOrEmail', {
                      required: 'Email or username is required',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-black focus:border-gray-500 outline-none"
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
                <button className="uppercase block w-full p-2 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none">
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
                    className="text-center block w-full px-4 py-2 mt-2 text-white bg-black focus:border-gray-500 border rounded-md   focus:outline-none focus:ring focus:ring-opacity-40 mx-3 text-xl outline-none"
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
                  className="uppercase block w-full p-2 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none"
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
                <div className="w-full inline-flex bg-gray-600">
                  <div className="w-1/12 flex justify-center items-center ">
                    <RiLockPasswordLine size={25} />
                  </div>
                  <input
                    id="newPassword"
                    type="password"
                    {...registerPassword('newPassword', {
                      required: 'Password is required',
                    })}
                    className="block w-full p-2 text-lg rounded-sm bg-black focus:border-gray-500 outline-none"
                    placeholder="Password"
                  />
                </div>

                {errorsPassword.newPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errorsPassword.newPassword.message}
                  </p>
                )}
              </div>

              <div className="px-2 pb-2 pt-2">
                <button className="uppercase block w-full p-2 text-lg rounded-full bg-indigo-500 hover:bg-indigo-600 focus:outline-none">
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
    <section className="min-h-screen flex items-stretch text-white ">
      <div
        className="lg:flex w-1/2 hidden bg-gray-500 bg-no-repeat bg-cover relative items-center"
        style={{
          backgroundImage:
            'url(https://images.unsplash.com/photo-1517130038641-a774d04afb3c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=4470&q=80)',
        }}
      >
        <div className="absolute bg-black opacity-60 inset-0 z-0" />
        <div className="w-full px-24 z-10">
          <h1 className="text-6xl font-bold text-left tracking-wide">
            Energis
          </h1>
          <p className="text-3xl my-4">
            Don't stop when you're tired. Stop when you're done.
          </p>
          <div className="flex items-center justify-start">
            <Typed
              className="md:text-2xl sm:text-xl text-xl font-bold"
              strings={[
                'Strength',
                'Endurance',
                'Flexibility',
                'Stamina',
                'Power',
                'Balance',
              ]}
              typeSpeed={120}
              backSpeed={140}
              loop
            />
          </div>
        </div>
        <div className="bottom-10 absolute p-4 text-center right-0 left-0 flex justify-center space-x-6">
          <span>
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
            </svg>
          </span>
          <span>
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
            </svg>
          </span>
          <span>
            <svg
              fill="#fff"
              xmlns="http://www.w3.org/2000/svg"
              width={24}
              height={24}
              viewBox="0 0 24 24"
            >
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
            </svg>
          </span>
        </div>
      </div>
      <div
        className="lg:w-1/2 w-full flex items-center md:px-16 px-6 z-0"
        style={{ backgroundColor: '#161616' }}
      >
        <div className="absolute lg:hidden z-10 inset-0 bg-gray-500 bg-no-repeat bg-cover items-center">
          <div className="absolute bg-black opacity-60 inset-0 z-0" />
        </div>
        <div className="w-full py-6 z-20">
          <h1 className="my-6 text-white text-3xl text-center">Energis</h1>

          <h1 className="text-xl font-semibold mb-6 text-center">
            Login your account
          </h1>

          <div className="relative w-full">
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

          {handleSteps()}
        </div>
      </div>
    </section>
  )
}

export default Login
