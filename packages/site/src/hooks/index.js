import { useEffect, useRef, useContext } from 'react'

import { StoreContext } from '../contexts'

const useStores = () => {
  return useContext(StoreContext)
}

// https://reactjs.org/docs/hooks-faq.html#how-to-get-the-previous-props-or-state
const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

export {
  useStores,
  usePrevious,
}
