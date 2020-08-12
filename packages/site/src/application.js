import React, { useState, useEffect } from 'react'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import { makeStyles } from '@material-ui/core/styles'

import { ENV } from 'site/config'
import { useGlobalState } from 'site/state'
import { RoutesNotLoggedIn, RoutesLoggedIn } from 'site/routes'
import { fetchCurrentUser } from 'site/services'
import { setApiAuth } from 'site/services/api'

import NotificationBar from 'site/components/notification-bar'

import styles from './styles'

const useStyles = makeStyles(styles)

const App = () => {
  const classes = useStyles()
  const [accessToken] = useGlobalState('accessToken')
  const [errors, setErrors] = useGlobalState('errors')
  const [init, setInit] = useState(!accessToken)
  const [error, setError] = useState(null)

  if (accessToken) {
    setApiAuth(accessToken)
    fetchCurrentUser().finally(() => { setInit(true) })
  }

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

if (ENV !== 'PROD') setConfig({ logLevel: 'debug', trackTailUpdates: false })

export default hot(App)
