import axios from 'axios'
import catchErrors from '../../utils/catchErrors'

export const registerUser = async (newdata, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}register`,
      newdata
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const registerUserFrontBook = async (newdata, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}register-booking-client`,
      newdata
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const registerComplete = async (newdata, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}complete-register`,
      newdata
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const loginUser = async (newdata, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}login`,
      newdata
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const checkUsernameRegister = async (username, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}register/${username}`
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const emailRequestForget = async (newdata, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}forget-password`,
      newdata
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const forgetPasswordCodeCheck = async (newdata, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}forget-password-code`,
      newdata
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const forgetPasswordUpdateRequest = async (newdata, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}forget-password-update`,
      newdata
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const updateUserData = async (data, authtoken, setError) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}user/userinfo`,
      data,
      {
        headers: {
          Authorization: `Bearer ${authtoken}`,
        },
      }
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const updateUserPassword = async (data, authtoken, setError) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}user/update-password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${authtoken}`,
        },
      }
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const googleLoginUser = async (newdata, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}google-login`,
      newdata
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const googleLoginUserBooking = async (newdata, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}google-login-booking`,
      newdata
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const getTrainerAndSchedule = async (username, setError) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}trainer/${username}`
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const getTrainerAndScheduleByIdFrontend = async (
  username,
  id,
  setError
) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}trainer/${username}/${id}`
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const updateTrainerCat = async (data, authtoken, setError) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}user/trainer-update-categories`,
      data,
      {
        headers: {
          Authorization: `Bearer ${authtoken}`,
        },
      }
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const getClientsNextPaymentDateFront = async (token, setError) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}next-payment-date`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const sendPaymentReminderFront = async (
  newdata,
  authtoken,
  setError
) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}send-payment-reminder`,
      newdata,
      {
        headers: {
          Authorization: `Bearer ${authtoken}`,
        },
      }
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}
