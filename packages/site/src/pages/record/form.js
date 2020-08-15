import React from 'react'
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

import NumberField from 'site/components/number-field'

import styles from './styles'

const useStyles = makeStyles(styles)

const TransactionForm = (props) => {
  const classes = useStyles()
  const {
    record,
    setRecord,
    handleSubmit,
    setOpen,
    handleCancel,
    setDeleteConfirmDialog,
  } = props

  return (
    <Paper style={{ width: '280px', padding: '1rem', position: 'fixed' }}>
      <Typography className={classes.title}>
        {record.id ? 'Detail Transaksi' : 'Tambah Transaksi'}
      </Typography>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          handleSubmit(record)
        }}
      >
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
        <div onClick={() => setOpen(true)} className={classes.selectCategoryField}>
          <Typography>
            {record && record.categoryName ? record.categoryName : 'Pilih Kategori'}
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
              onClick={handleCancel}
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
    </Paper>
  )
}

export default TransactionForm
