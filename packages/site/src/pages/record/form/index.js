import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { ArrowForwardIos } from '@material-ui/icons'
import { KeyboardDatePicker } from '@material-ui/pickers'
import {
  TextField,
  Button,
  FormControl,
  Paper,
  Typography,
} from '@material-ui/core'

import { ASSET_URL } from 'site/config'
import { useGlobalState, DEFAULT_RECORD } from 'site/state'
import { categoryIconName } from 'site/utils/helper'
import NumberField from 'site/components/number-field'
import ConfirmDialog from 'site/components/confirm-dialog'
import CategoryDialog from '../category'

import styles from './styles'

const useStyles = makeStyles(styles)

const RecordForm = (props) => {
  const classes = useStyles()

  const [selectedRecord] = useGlobalState('selectedRecord')

  const [record, setRecord] = useState(DEFAULT_RECORD)
  const [categoryDialog, setCategoryDialog] = useState(false)
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false)

  useEffect(() => {
    if (!selectedRecord) {
      setRecord(DEFAULT_RECORD)
      return
    }
    setRecord(selectedRecord)
  }, [selectedRecord])

  const onDelete = async () => {
    await props.onDelete(record)
    setDeleteConfirmDialog(false)
  }

  const onSubmit = async (event) => {
    event.preventDefault()
    await props.onSubmit({
      id: record.id,
      amount: record.amount,
      note: record.note,
      transactionDate: record.transactionDate,
      category: { id: record.category.id },
    })
    setRecord(DEFAULT_RECORD)
  }

  return (
    <Paper className={classes.formContainer}>
      <Typography className={classes.title}>
        {record.id ? 'Detail Transaksi' : 'Tambah Transaksi'}
      </Typography>
      <form onSubmit={onSubmit}>
        <FormControl fullWidth style={{ marginBottom: '1rem' }}>
          <TextField
            label="Jumlah"
            value={record.amount}
            onChange={(event) => setRecord({ ...record, amount: event.target.value })}
            type="text"
            name="amount"
            autoFocus
            InputProps={{
              inputComponent: NumberField,
            }}
          />
        </FormControl>
        <div onClick={() => setCategoryDialog(true)} className={classes.selectCategoryField}>
          {record.category && (
            <img
              src={`${ASSET_URL}/assets/icons/${categoryIconName(record.category.name)}.png`}
              className={classes.categoryIcon}
              alt={record.category.name}
            />
          )}
          <Typography className={classes.categoryLabel}>
            {record && record.category ? record.category.name : 'Pilih Kategori'}
          </Typography>
          <ArrowForwardIos />
        </div>
        <KeyboardDatePicker
          autoOk // on select it will auto close the calendar
          margin="normal"
          label="Tanggal transaksi"
          format="dd/MM/yyyy"
          variant="inline"
          value={record.transactionDate}
          onChange={(date) => setRecord({ ...record, transactionDate: date })}
        />
        <FormControl fullWidth style={{ marginBottom: '1rem' }}>
          <TextField
            fullWidth
            value={record.note}
            onChange={(event) => setRecord({ ...record, note: event.target.value })}
            label="Catatan"
            multiline
            rows="4"
            margin="normal"
            name="note"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
        </FormControl>
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          {record.id && (
            <Button
              variant="contained"
              size="large"
              color="secondary"
              onClick={props.onCancel}
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              Batal
            </Button>
          )}
          {record.id && (
            <Button
              variant="contained"
              size="large"
              onClick={() => setDeleteConfirmDialog(true)}
              className={classes.deleteButton}
            >
              Hapus
            </Button>
          )}
          <Button
            variant="contained"
            size="large"
            color="primary"
            type="submit"
            style={{ color: 'white', fontWeight: 'bold' }}
          >
            {record.id ? 'Ubah' : 'Tambah'}
          </Button>
        </div>
      </form>
      <CategoryDialog
        open={categoryDialog}
        selectedCategory={record.category}
        onClose={() => setCategoryDialog(false)}
        onSelectCategory={(category) => {
          setRecord({ ...record, category })
          setCategoryDialog(false)
        }}
      />
      <ConfirmDialog
        open={deleteConfirmDialog}
        title="Konfirmasi Hapus"
        content="Hapus transaksi ini?"
        onClose={() => setDeleteConfirmDialog(false)}
        onAccept={onDelete}
      />
    </Paper>
  )
}

export default RecordForm
