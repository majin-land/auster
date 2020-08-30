import React, { useState } from 'react'
import {
  TextField,
  Button,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
} from '@material-ui/core'

import { addCategory } from 'site/services'

const CategoryDialogForm = (props) => {
  const {
    open,
    onClose,
  } = props

  const [category, setCategory] = useState({ name: '', type: 'expense' })

  const onCreateCustomCategory = async (event) => {
    event.preventDefault()
    await addCategory({
      name: category.name,
      type: category.type,
    })
    setCategory({ name: '', type: 'expense' })
  }

  return (
    <Dialog
      maxWidth="xs"
      fullWidth
      open={open}
      onClose={(event) => {
        event.preventDefault()
        onClose()
      }}
    >
      <DialogTitle>
        Create custom category
      </DialogTitle>
      <DialogContent>
        <form onSubmit={onCreateCustomCategory}>
          <FormControl fullWidth style={{ marginBottom: '1rem' }}>
            <TextField
              label="Nama custom category"
              value={category.name}
              onChange={(event) => setCategory({ ...category, name: event.target.value })}
              type="text"
              name="category"
            />
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '1rem' }}>
            <TextField
              label="Category type"
              value={category.type}
              onChange={(event) => setCategory({ ...category, type: event.target.value })}
              type="text"
              name="type"
            />
          </FormControl>
          <Button type="submit">
            Create category
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default CategoryDialogForm
