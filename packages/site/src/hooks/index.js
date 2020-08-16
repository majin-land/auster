import { useEffect, useRef, useState } from 'react'

import errorHandler from 'site/services/error-handler'
import { useGlobalState } from 'site/state'

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

// https://dev.to/gabe_ragland/debouncing-with-react-hooks-jci
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// https://medium.com/better-programming/react-state-management-in-2020-719d10c816bf
export const useRequest = (api) => {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [response, setResponse] = useState(null)

  const [errors, setErrors] = useGlobalState('errors')

  const request = (params) => {
    setLoading(true)
    setError(false)

    return api(params)
      .then((data) => {
        if (data.ok) {
          setResponse(data)
          return data
        }
        throw errorHandler(data)
      })
      .catch((e) => {
        setError(e)
        setErrors([
          ...errors,
          e,
        ])
      })
      .finally(() => setLoading(false))
  }

  return { isLoading, error, response, request }
}
