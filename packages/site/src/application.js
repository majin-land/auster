import React from 'react'
import { hot } from 'react-hot-loader/root'
import { setConfig } from 'react-hot-loader'
import { Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { ENV } from './config'

import styles from './styles'

const useStyles = makeStyles(styles)

const App = () => {
  const classes = useStyles()

  return (
    <div className={classes.rootContainer}>
      <main className={classes.contentContainer}>
        <Typography variant="h1">
          Auster
        </Typography>
      </main>
    </div>
  )
}

if (ENV !== 'PROD') setConfig({ logLevel: 'debug', trackTailUpdates: false })

export default hot(App)
