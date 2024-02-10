import axios from 'axios'
import catchErrors from '../../utils/catchErrors'

export const stripePaymentIntent = async (newdata, authtoken, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}payment-intent-payment-stripe`,
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

export const saveOrderData = async (newdata, authtoken, setError) => {
  try {
    const res = await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}order-data-save`,
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
