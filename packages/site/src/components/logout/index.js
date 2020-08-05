import React from 'react'
import {
  Button,
} from '@material-ui/core'

import { useRequest } from '~/src/hooks'
import { logout } from '~/src/services'
import { useGlobalState, saveState } from '~/src/state'
import { setApiAuth } from '~/src/services/api'

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
      variant="outlined"
    >
      Logout
    </Button>
  )
}

export default LogoutButton
