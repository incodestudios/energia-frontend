import axios from 'axios'
import catchErrors from '../../utils/catchErrors'

export const registerFrontClient = async (newdata, authtoken, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}register-new-client`,
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

export const resendLinkRegFrontClient = async (
  newdata,
  authtoken,
  setError
) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}resend-verification-link`,
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

export const verifyClientToken = async (token, setError) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}client-verify-account/${token}`
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const updateClientCredentials = async (uId, data, setError) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}set-client-credentials/${uId}`,
      data
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const sendScheduleData = async (newdata, authtoken, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}add-schedule-trainer`,
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

export const getScheduleTrainer = async (token, setError) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}get-trainer-schedule`,
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

export const getScheduleClientsFront = async (token, setError) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}get-clients-schedule`,
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

export const deleteSchedule = async (id, authtoken, setError) => {
  try {
    const res = axios.delete(
      `${process.env.REACT_APP_BACKEND_URL}schedule-del/${id}`,
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

export const updateSchedule = async (shIdFound, data, authtoken, setError) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}update-schedule/${shIdFound}`,
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

export const getClientsTrainer = async (token, setError) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}client-list-trainer`,
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

export const updateClientSchedule = async (data, authtoken, setError) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}update-client-schedules-by-trainer`,
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
