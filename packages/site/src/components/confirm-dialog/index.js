import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@material-ui/core'

const ConfirmDialog = (props) => {
  const {
    open,
    title,
    content,
    onClose,
    onAccept,
  } = props

  return (
    <Dialog
      maxWidth="lg"
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
          onClick={onClose}
          style={{ texttransform: "none" }}
        >
          Batal
        </Button>
        <Button
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

export default ConfirmDialog
