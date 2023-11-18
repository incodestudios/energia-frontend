import React from 'react'
import { useNavigate } from 'react-router-dom'

const ErrorModal = () => {
  const navigate = useNavigate()

  const handleClose = () => {
    navigate('/')
  }

  return (
    <div className="fixed top-0 right-0 bottom-0 left-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-center">
        <h3 className="text-lg font-bold mb-4">Error</h3>
        <p className="text-lg">Invalid or expired token</p>
        <div className="mt-6">
          <button
            className="bg-sky-500 hover:bg-sky-400 text-white font-bold py-2 px-4 rounded"
            onClick={handleClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ErrorModal
