import axios from 'axios'
import catchErrors from '../../utils/catchErrors'

export const addCategory = async (newdata, authtoken, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}add-new-category`,
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

export const getAdminCategories = async (token, setError) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}get-admin-categories`,
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

export const getCategories = async (setError) => {
  try {
    const res = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}get-categories`
    )
    setError(null)
    return res
  } catch (error) {
    const errorMsg = catchErrors(error)
    setError(errorMsg)
  }
}

export const updateCategoryFrontendByAdmin = async (
  data,
  slug,
  authtoken,
  setError
) => {
  try {
    const res = await axios.put(
      `${process.env.REACT_APP_BACKEND_URL}category/${slug}`,
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
