import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import styles from './styles'

const useStyles = makeStyles(styles)

const DeleteDialog = (props) => {
  const {
    open,
    title,
    content,
    onClose,
    onAccept,
  } = props

  const classes = useStyles()

  return (
    <Dialog
      maxWidth="sm"
      open={open}
      onClose={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <DialogTitle>
        {title}
      </DialogTitle>
      <DialogContent>
        {content}
      </DialogContent>
      <DialogActions>
        <Button
          variant="text"
          color="primary"
          onClick={onClose}
        >
          Batal
        </Button>
        <Button
          variant="contained"
          onClick={(event) => {
            event.preventDefault()
            onAccept()
          }}
        >
          Konfirmasi
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteDialog
