import axios from 'axios'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import BarLoader from 'react-spinners/BarLoader'
import ErrorModal from '../error/ErrorModal'
import SetCredentialsPage from '../../pages/Auth/SetCredentialsPage'
import { verifyClientToken } from '../functions/client'
import { Lottie } from '@crello/react-lottie'
import animationData from '../../assets/loader.json'

const TokenHandler = () => {
  const [isValid, setIsValid] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const { token } = useParams()
  const [userData, setUserData] = useState(false)

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await verifyClientToken(token, setError)
        if (response && response?.status === 200) {
          setUserData(response?.data?.data)
          setIsValid(true)
        }
      } catch (error) {
        console.log(error)
        setIsValid(false)
      } finally {
        setLoading(false)
      }
    }

    verifyToken()
  }, [token])

  if (loading) {
    return (
      <div className="grid h-screen place-items-center">
        <div className="flex justify-center items-center">
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
        </div>
      </div>
    )
  }

  console.log(isValid)

  return isValid ? (
    <SetCredentialsPage token={token} userData={userData} />
  ) : (
    <ErrorModal />
  )
}

export default TokenHandler
