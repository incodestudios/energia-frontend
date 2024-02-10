import { PaymentElement, useElements, useStripe } from '@stripe/react-stripe-js'

import { useSelector } from 'react-redux'
import { saveOrderData } from '../../components/functions/payment'
import { toast } from 'react-toastify'

const StripeCheckout = ({
  setClientSecret,
  clientSecret,
  selectedPriceDetail,
  setLoadingPayment,
  loadingPayment,
  checkoutData,
  setCheckoutData,
  setError,
  setBookingDetails,
  setSucceeded,
}) => {
  const user = useSelector((state) => state.user)

  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newData = {
      scheduleId: checkoutData?.scheduleId,
      amount: Math.round(checkoutData?.amount / 100),
      trainer: checkoutData?.trainer,
    }

    if (!stripe || !elements) {
      toast.error('Stripe is not loaded yet')
      return
    }

    try {
      setLoadingPayment(true)
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {},
        redirect: 'if_required',
      })

      if (error) {
        toast.error(error.message)
        setLoadingPayment(false)
        return
      } else {
        const saveOrderRes = await saveOrderData(newData, user?.token, setError)
        if (saveOrderRes.status === 200) {
          localStorage.removeItem('bookingDetails')
          setCheckoutData(null)
          setClientSecret(null)
          setBookingDetails(null)
          setSucceeded(true)
        } else {
          toast.error('Error saving order data.')
        }
        setLoadingPayment(false)
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error)
      setLoadingPayment(false)
      toast.error('An unexpected error occurred.')
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <PaymentElement />
        <button
          className={`my-6 block w-full bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 rounded mr-10 px-10 ${
            loadingPayment && 'ActionButton'
          }`}
          type="submit"
        >
          Pay
        </button>
      </form>
    </div>
  )
}

export default StripeCheckout
