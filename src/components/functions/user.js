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
