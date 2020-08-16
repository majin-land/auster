import { createGlobalState } from 'react-hooks-global-state'
import moment from 'moment'

const STORAGE_KEY = 'auster'

const DEFAULT_RECORD = {
  id: '',
  type: 'expense',
  amount: '',
  category: null,
  transactionDate: moment(),
  note: '',
}

let initState = {
  accessToken: null,
  user: null,
  errors: [],
  notifications: [],
  selectedRecord: DEFAULT_RECORD,
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
  DEFAULT_RECORD,
}
