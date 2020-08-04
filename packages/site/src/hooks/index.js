import { useEffect, useRef, useState } from 'react'

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
export const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

// https://medium.com/better-programming/react-state-management-in-2020-719d10c816bf
export const useRequest = (api) => {
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [response, setResponse] = useState(null)

  const request = (params) => {
    setLoading(true)
    setError(false)

    return api(params)
      .then((data) => {
        setResponse(data)
        return data
      })
      .catch((e) => setError(e))
      .finally(() => setLoading(false))
  }

  return { isLoading, error, response, request }
}
