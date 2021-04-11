import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import { useGlobalState, saveState } from 'site/state'
import { RoutesNotLoggedIn, RoutesLoggedIn } from 'site/routes'
import { fetchCurrentUser } from 'site/services'
import { setApiAuth } from 'site/services/api'
import { useApiRequest } from 'site/hooks'

import NotificationBar from 'site/components/notification-bar'

import styles from './styles'

const useStyles = makeStyles(styles)

const App = () => {
  const classes = useStyles()
  const [accessToken, setAccessToken] = useGlobalState('accessToken')
  const [, setUser] = useGlobalState('user')
  const [errors, setErrors] = useGlobalState('errors')
  const [init, setInit] = useState(false)
  const [error, setError] = useState(null)

  const {
    request: fetchCurrentUserRequest,
  } = useApiRequest(fetchCurrentUser, { defaultLoading: true })

  useEffect(() => {
    if (!accessToken) {
      setInit(true)
      return
    }

    setApiAuth(accessToken)

    const fetchUser = async () => {
      try {
        const res = await fetchCurrentUserRequest()
        console.log('res', res)
        if (!res) {
          console.log('clear AUTH')
          setApiAuth(null)
          setAccessToken(null)
          setUser(null)
          saveState()
        }
      } finally {
        setInit(true)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    if (errors.length === 0) return
    setError((errors.length > 0) ? errors[0] : null)
    setErrors(errors.slice(1))
  }, [errors])

  if (!init) return null

  return (
    <main className={classes.rootContainer}>
      {accessToken ? <RoutesLoggedIn /> : <RoutesNotLoggedIn />}
      <NotificationBar
        severity="error"
        open={!!error}
        message={error ? error.message : ''}
        onClose={() => { setError(null) }}
      />
    </main>
  )
}

export default App
