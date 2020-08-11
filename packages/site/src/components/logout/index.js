import React from 'react'
import {
  Button,
} from '@material-ui/core'

import { useRequest } from 'site/hooks'
import { logout } from 'site/services'
import { useGlobalState, saveState } from 'site/state'
import { setApiAuth } from 'site/services/api'

const LogoutButton = () => {
  const { isLoading, request: logoutRequest } = useRequest(logout)

  const [, setAccessToken] = useGlobalState('accessToken')
  const [, setUser] = useGlobalState('user')

  const doLogout = async () => {
    await logoutRequest()
    setApiAuth(null)
    setAccessToken(null)
    setUser(null)
    saveState()
  }

  return (
    <Button
      onClick={doLogout}
      disabled={isLoading}
    >
      Logout
    </Button>
  )
}

export default LogoutButton
