import { create } from 'apisauce'
import qs from 'qs'

const scheme = process.env.SERVER_SCHEME || 'http'
const host = process.env.SERVER_HOST || 'localhost'
const port = process.env.SERVER_PORT || '4010'

const baseURL = `${scheme}://${host}:${port}`

const _api = create({
  baseURL,
  headers: {
    Accept: 'application/json;charset=UTF-8',
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache',
  },
  paramsSerializer: qs.stringify,
  timeout: 30000,
})

// any 401 error means session expired or login info invalid, should set loggedIn false
const loginMonitor = (response) => {
  if (response.status === 401) {
    // eslint-disable-next-line no-console
    console.log('NOT AUTHORISED!')
  }
}
_api.addMonitor(loginMonitor)

export const setApiAuth = token => _api.setHeader('Authorization', token)
export const api = _api
