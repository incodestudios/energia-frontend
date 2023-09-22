const catchErrors = (error) => {
  let errorMsg
  if (error.response) {
    errorMsg = error.response.data.message
  } else if (error.request) {
    errorMsg = error.request
  } else {
    errorMsg = error.message
  }
  return errorMsg
}

export default catchErrors
