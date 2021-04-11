import { useEffect, useRef, useState, useCallback } from 'react'

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

// https://medium.com/better-programming/react-state-management-in-2020-719d10c816bf
export const useApiRequest = (api, {
  blocking = false, // set to true, if dont allow concurrent request
  silentFail = false, // set to true, if dont want to use global notification error bar
  initialData = null, // set default initial data
  transformData = d => d, // custom transform data logic
  defaultLoading = false,
}) => {
  const [isLoading, setLoading] = useState(defaultLoading)
  const [error, setError] = useState(null)
  const [response, setResponse] = useState({ data: initialData })
  const [data, setData] = useState(initialData)

  const [errors, setErrors] = useGlobalState('errors')

  const request = useCallback(async (...params) => {
    if (blocking && isLoading) return null
    setLoading(true)
    setError(false)
    try {
      const resp = await api(...params)
      if (resp.ok) {
        setResponse(resp)
        setData(transformData(resp.data))
        return resp
      }
      throw errorHandler(resp)
    } catch (err) {
      if (silentFail) return null
      setErrors([
        ...errors,
        err,
      ])
    } finally {
      setLoading(false)
    }
    return null
  }, [])

  return { isLoading, error, data, response, request }
}
