import React, { useState } from 'react'
import Resizer from 'react-image-file-resizer'
import axios from 'axios'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
const imagePreviewIcon = require('../../assets/image-preview.png')

const ImageUpload = ({
  selectedImage,
  selectedPublicId,
  setSelectedImage,
  setSelectedPublicId,
  setLoading,
  user,
}) => {
  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    handleImageUpload(file)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }

  const handleFileUpload = (e) => {
    const file = e.target.files[0]

    handleImageUpload(file)
  }

  const handleImageUpload = (file) => {
    if (selectedImage) {
      return toast.error('You can only upload one image at a time')
    }

    if (file.size / 1024 > 5120) {
      return toast.error('File size should be less than 5MB')
    }

    setLoading(true)

    Resizer.imageFileResizer(
      file,
      720,
      720,
      'JPEG',
      100,
      0,
      async (uri) => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_BACKEND_URL}${'upload-image'}`,
            { image: uri },
            {
              headers: {
                Authorization: user ? `Bearer ${user?.token}` : '',
              },
            }
          )

          setLoading(false)
          setSelectedImage(response?.data?.url)
          setSelectedPublicId(response?.data?.public_id)
        } catch (error) {
          setLoading(false)
          console.log('CLOUDINARY UPLOAD ERR', error)
        }
      },
      'base64'
    )
  }

  const handleImageRemove = (public_id) => {
    if (!public_id) {
      setSelectedImage(null)
      return
    }

    setLoading(true)
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_URL}${'remove-image'}`,
        { public_id },
        {
          headers: {
            Authorization: user ? `Bearer ${user.token}` : '',
          },
        }
      )
      .then((res) => {
        setLoading(false)
        if (res.status === 200) {
          setSelectedImage(null)
          setSelectedPublicId(null)
        }
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
      })
  }

  return (
    <>
      {selectedImage && (
        <div
          style={{
            position: 'relative',
            display: 'inline-block',
          }}
        >
          <div
            onClick={() =>
              handleImageRemove(selectedPublicId ? selectedPublicId : null)
            }
            className="custom_image_remove_icon"
          >
            X
          </div>
          <img
            src={selectedImage}
            alt="Profile"
            style={{
              width: '200px',
              height: '200px',
              objectFit: 'cover',
              marginBottom: '10px',
            }}
          />
        </div>
      )}

      {!selectedImage && (
        <div
          className="border border-sky-500 rounded h-48 w-60 flex flex-col items-center justify-center mb-6"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <div className="mb-2 mt-2">
            <img
              src={imagePreviewIcon}
              alt="Preview"
              className="h-16 w-16 object-contain mt-3"
            />
          </div>
          <div>Drag image here</div>
          <label
            htmlFor="image-upload"
            className="text-sky-500 text-xs mt-1 mb-4 cursor-pointer"
          >
            Browse image
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              className="hidden"
              onChange={handleFileUpload}
            />
          </label>
        </div>
      )}
    </>
  )
}

export default ImageUpload
