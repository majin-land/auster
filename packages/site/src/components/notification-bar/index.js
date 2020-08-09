import React from 'react'
import { Snackbar } from '@material-ui/core'
import { Alert } from '@material-ui/lab'

const NotificationBar = (props) => {
  const autoHideDuration = props.autoHideDuration || 6000

  if (!props.message) return null

  return (
    <Snackbar
      open={props.open}
      autoHideDuration={autoHideDuration}
      onClose={props.onClose}
    >
      <Alert
        onClose={props.onClose}
        severity={props.severity}
      >
        {props.message}
      </Alert>
    </Snackbar>
  )
}

export default NotificationBar
