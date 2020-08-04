import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import {
  Typography,
} from '@material-ui/core'

import LogoutButton from '~/src/components/logout'

import styles from './styles'

const useStyles = makeStyles(styles)

const Record = () => {
  const classes = useStyles()

  return (
    <div className={classes.container}>
      <Typography variant="h1">
        Auster
      </Typography>
      <LogoutButton />
    </div>
  )
}

export default Record
