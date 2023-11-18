import React, { useState, useEffect } from 'react'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Cookies from 'js-cookie'
import axios from 'axios'
import { googleLoginUser } from '../../components/functions/user'

const GoogleAuth = ({
  setLoading,
  loading,
  success,
  setSuccess,
  error,
  setError,
}) => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const handleGoogleLogin = async (gData) => {
    try {
      setTimeout(() => {
        const { message, ...dataWithoutMessage } = gData
        dispatch({ type: 'LOGIN', payload: dataWithoutMessage })

        Cookies.set('user', JSON.stringify(dataWithoutMessage), {
          expires: 30,
        })
        navigate('/')
        setSuccess('')
      }, 1500)
    } catch (error) {
      console.log(error)
    }
  }

  const googleLogin = async (credentialResponse) => {
    const newData = {
      tokenGoogle: credentialResponse.credential,
    }

    try {
      setLoading(true)
      const response = await googleLoginUser(newData, setError)
      if (response && response.status === 200) {
        await handleGoogleLogin(response.data)
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }
  return (
    <div>
      <div className="flex justify-center items-center ">
        <GoogleOAuthProvider clientId="617911306322-57924dpee5ukbp2fn614c9lol7rq3bmp.apps.googleusercontent.com">
          <GoogleLogin
            useOneTap
            onSuccess={async (credentialResponse) =>
              googleLogin(credentialResponse)
            }
            onError={() => {
              console.log('Login Failed')
            }}
          />
        </GoogleOAuthProvider>
      </div>
    </div>
  )
}

export default GoogleAuth
