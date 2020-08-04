import React from 'react'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import { makeStyles } from '@material-ui/core/styles'

import { ENV } from './config'
import { useGlobalState } from './state'
import { RoutesNotLoggedIn, RoutesLoggedIn } from './routes'
import { session } from '~/src/services'

import styles from './styles'

const useStyles = makeStyles(styles)

const App = () => {
  const classes = useStyles()
  const [accessToken] = useGlobalState('accessToken')
  if (accessToken) {
    session().then((response) => {
      console.log(response)
    })
  }

  return (
    <main className={classes.rootContainer}>
      {accessToken ? <RoutesLoggedIn /> : <RoutesNotLoggedIn />}
    </main>
  )
}

if (ENV !== 'PROD') setConfig({ logLevel: 'debug', trackTailUpdates: false })

export default hot(App)
