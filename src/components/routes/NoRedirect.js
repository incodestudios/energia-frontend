import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { useSelector } from 'react-redux'

const NoRedirect = () => {
  const [count, setCount] = useState(3)
  const navigate = useNavigate()
  const user = useSelector((state) => state.user)

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount)
    }, 1000)
    if (count === 0) {
      user?.role === 'admin'
        ? navigate('/admin/dashboard')
        : navigate('/dashboard')
    }

    // cleanup
    return () => clearInterval(interval)
  }, [count, navigate])

  return (
    <div className="container-fluid p-5 text-center">
      <p className="text-success h6 my-2 d-flex justify-content-center align-items-center">
        <ExclamationCircleOutlined
          style={{ fontSize: '20px', color: 'green', marginRight: '5px' }}
        />{' '}
        You are already logged In{' '}
      </p>
      <p className="text-muted"> Redirecting you in {count} seconds</p>
    </div>
  )
}

export default NoRedirect
