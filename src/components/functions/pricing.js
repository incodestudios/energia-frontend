import axios from 'axios'
import catchErrors from '../../utils/catchErrors'

export const addPrice = async (newdata, authtoken, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}add-new-price`,
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

export const getAdminPricing = async (token, setError) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}get-admin-pricing`,
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

export const getPricing = async (setError) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}get-pricing`
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const updatePricingFrontendByAdmin = async (
  data,
  id,
  authtoken,
  setError
) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}pricing/${id}`,
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
