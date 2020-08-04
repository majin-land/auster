import { createGlobalState } from 'react-hooks-global-state'

const STORAGE_KEY = 'auster'

// check from localStorage for saved state
const cacheStr = localStorage.getItem(STORAGE_KEY)
const initialState = (cacheStr) ? JSON.parse(cacheStr) : {
  accessToken: null,
  user: null,
}

const { setGlobalState, useGlobalState, getState } = createGlobalState(initialState)

const saveState = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(getState()))
}

export {
  setGlobalState,
  useGlobalState,
  saveState,
}
