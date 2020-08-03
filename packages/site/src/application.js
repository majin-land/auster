import React from 'react'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import { makeStyles } from '@material-ui/core/styles'

import { ENV } from './config'

import RoutesNotLoggedIn from './routes-not-loggedin'

import styles from './styles'

const useStyles = makeStyles(styles)

const App = () => {
  const classes = useStyles()

  return (
    <div className={classes.rootContainer}>
      <RoutesNotLoggedIn/>
    </div>
  )
}

if (ENV !== 'PROD') setConfig({ logLevel: 'debug', trackTailUpdates: false })

export default hot(App)
