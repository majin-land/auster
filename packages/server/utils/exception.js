const template = (error, status) => {
  // error is an object
  if (typeof error.message !== 'undefined') {
    // return error itself
    return [{
      code: status,
      type: error.type,
      message: error.message,
    }, status]
  }

  // undefined error
  return [{
    code: 500,
    message: error,
  }, 500]
}

// if error more than one, take first only
const response = (error) => {
  // pre-defined error object
  if (
    typeof error.type !== 'undefined' &&
    error.type !== null &&
    typeof error.message !== 'undefined' &&
    error.message !== null
  ) {
    return [{ code: 400, ...error }, (error.code || 400)]
  }

  if (error === 'timeout') {
    return [{
      code: 500,
      message: error,
    }, 500]
  }

  return template((error.details || error.message), 400)
}

module.exports = response
