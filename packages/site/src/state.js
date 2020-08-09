import { createGlobalState } from 'react-hooks-global-state'

const STORAGE_KEY = 'auster'

let initState = {
  accessToken: null,
  user: null,
  errors: [],
  notifications: [],
}

// check from localStorage for saved state
const cacheStr = localStorage.getItem(STORAGE_KEY)
if (cacheStr) {
  try {
    const cacheState = JSON.parse(cacheStr)
    initState = {
      ...initState,
      ...cacheState,
    }
  } catch (error) {
    console.log('Error in parsing cache state', error)
  }
}

const { setGlobalState, useGlobalState, getState } = createGlobalState(initState)

const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getState()))
}

export {
  setGlobalState,
  useGlobalState,
  saveState,
}
