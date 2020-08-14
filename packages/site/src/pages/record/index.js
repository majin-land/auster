import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import moment from 'moment'
import {
  Check,
  Search,
  ArrowDropDown,
  ArrowForwardIos,
} from '@material-ui/icons'
import { KeyboardDatePicker } from '@material-ui/pickers'
import {
  TextField,
  IconButton,
  Button,
  FormControl,
  Dialog,
  Paper,
  DialogActions,
  Tabs,
  Tab,
  AppBar,
  Divider,
  Typography,
  Menu,
  MenuItem,
  InputLabel,
  Select,
} from '@material-ui/core'

import { formatNumber } from 'site/utils/helper'
import { useRequest } from 'site/hooks'
import { useGlobalState } from 'site/state'
import { fetchCategory, addRecord, fetchRecord, deleteRecord, updateRecord } from 'site/services'

import LogoutButton from 'site/components/logout'
import ConfirmDialog from 'site/components/confirm-dialog'
import TabPanel from 'site/components/tab-panel'
import NumberField from 'site/components/number-field'

import styles from './styles'

const TODAY = moment()
const MAX_YEAR = TODAY.year()
const MONTHS = []
const YEARS = []

for (let month = 0; month < 12; month++) {
  MONTHS.push({ key: month, label: moment().month(month).format('MMMM') })
}

for (let year = 2020; year <= MAX_YEAR; year++) {
  YEARS.push(year)
}

const DEFAULT_RECORD = {
  id: '',
  type: 'expense',
  amount: '',
  category: null,
  categoryName: '',
  transactionDate: moment(),
  note: '',
}

const useStyles = makeStyles(styles)

const Record = () => {
  const classes = useStyles()

  const { request: submitRecord } = useRequest(addRecord)
  const [user] = useGlobalState('user')

  const [open, setOpen] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [record, setRecord] = useState(DEFAULT_RECORD)
  const [recordList, setRecordList] = useState({})
  const [categoryTabIndex, setCategoryTabIndex] = useState(0)
  const [transactionTabIndex, setTransactionTabIndex] = useState(1)
  const [anchorEl, setAnchorEl] = useState(null)
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'))
  const [month, setMonth] = useState(moment(startDate).subtract(1, 'months').format('M'))
  const [year, setYear] = useState(moment(endDate).format('YYYY'))
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const fetchData = async () => {
    const dataCategory = await fetchCategory()
    const { list } = dataCategory.data
    const categoryTree = list.reduce((arr, item) => {
      if (item.parentId && item.parentId !== '0') {
        const category = list.find(cat => String(cat.id) === String(item.parentId))
        if (category) {
          if (!category.children) category.children = []
          category.children.push(item)
        }
      } else {
        arr.push(item)
      }
      return arr
    }, [])

    setCategoryList(categoryTree)
  }

  const fetchRecordData = async (start, end) => {
    const response = await fetchRecord({ startDate: start, endDate: end })
    setRecordList(response.data)
  }

  useEffect(() => {
    fetchRecordData(startDate, endDate)
    fetchData()
  }, [])

  useEffect(() => {
    fetchRecordData(startDate, endDate)
  }, [startDate, endDate])

  const renderBalance = () => {
    return (
      <div className={classes.currentBalance}>
        <Typography className={classes.title}>
          Saldo
        </Typography>
        <div>
          <div className={classes.currentBalanceInfo}>
            <Typography>
              Pemasukan
            </Typography>
            <Typography>
              {formatNumber(recordList.income || 0)}
            </Typography>
          </div>
          <div className={classes.currentBalanceInfo}>
            <Typography>
              Pengeluaran
            </Typography>
            <Typography>
              -{formatNumber(recordList.expense || 0)}
            </Typography>
          </div>
          <div className={classes.currentBalanceInfo}>
            <Typography>
              Total Saldo
            </Typography>
            <Typography>
              {(formatNumber(recordList.income - recordList.expense) || 0)}
            </Typography>
          </div>
        </div>
      </div>
    )
  }

  const handleCancel = () => {
    setRecord(DEFAULT_RECORD)
  }

  const handleSubmit = async (recordData) => {
    let response = null
    if (recordData.id) {
      response = await updateRecord(recordData)
    } else {
      response = await submitRecord(recordData)
    }
    if (response.ok) {
      fetchRecordData(startDate, endDate)
      handleCancel()
    }
  }

  const handleDelete = async (id) => {
    const response = await deleteRecord(id)
    if (response.ok) {
      handleCancel()
      setDeleteConfirmDialog(false)
      fetchRecordData(startDate, endDate)
    }
  }

  const renderDeleteDialog = () => {
    return (
      <ConfirmDialog
        open={deleteConfirmDialog}
        title="Konfirmasi Hapus"
        content="Hapus transaksi ini ?"
        onClose={() => setDeleteConfirmDialog(false)}
        onAccept={() => handleDelete(record.id)}
      />
    )
  }

  const renderTransactionForm = () => {
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
          <div
            onClick={() => setOpen(true)}
            style={{ padding: '0.2rem 0 0.5rem', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', borderBottom: '1px solid grey' }}
          >
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

  const selectCategory = (id, name, type) => {
    if (id === record.category) {
      setRecord({ ...record, type: 'expense', category: null, categoryName: '' })
    } else {
      setRecord({ ...record, type, category: id, categoryName: name })
    }
    setOpen(false)
  }

  const renderCategoryDialog = () => {
    return (
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
      >
        <AppBar position="static">
          <Tabs
            value={categoryTabIndex}
            onChange={(event, newIndex) => setCategoryTabIndex(newIndex)}
          >
            <Tab label="EXPENSE" />
            <Tab label="INCOME" />
          </Tabs>
        </AppBar>
        <Paper style={{ overflowY: 'auto' }}>
          <TabPanel value={categoryTabIndex} index={0}>
            {categoryList.map((category) => {
              if (category.type !== 'expense') return null
              const name = category.name
              const removeSpecialChar = name.replace(/[^\w\s]/gi, '')
              const imgName = removeSpecialChar.replace(' ', '_').replace(' ', '')
              return (
                <div key={category.id}>
                  <div
                    className={classes.listCategory}
                    onClick={() => selectCategory(category.id, category.name, 'expense')}
                  >
                    <Typography>
                      {category.name}
                    </Typography>
                    {category.id === record.category && <Check className={classes.checkIcon} />}
                  </div>
                  <div>
                    {category.children &&
                      category.children.map((data) => {
                        const childName = data.name
                        const removeChildSpecialChar = childName.replace(/[^\w\s]/gi, '')
                        const childImgName = removeChildSpecialChar.replace(' ', '_').replace(' ', '')
                        return (
                          <div
                            key={data.id}
                            className={classes.listCategoryChildren}
                            onClick={() => selectCategory(data.id, data.name, 'expense')}
                          >
                            <Typography>
                              {data.name}
                            </Typography>
                            {data.id === record.category && <Check className={classes.checkIcon} />}
                          </div>
                        )
                      })}
                  </div>
                  <Divider />
                </div>
              )
            })}
          </TabPanel>
          <TabPanel value={categoryTabIndex} index={1}>
            {categoryList.map((category) => {
              if (category.type !== 'income') return null
              return (
                <div key={category.id}>
                  <div
                    className={classes.listCategory}
                    onClick={() => selectCategory(category.id, category.name, 'income')}
                  >
                    <Typography>
                      {category.name}
                    </Typography>
                    {category.id === record.category && <Check className={classes.checkIcon} />}
                  </div>
                  <div>
                    {category.children &&
                    category.children.map((data) => {
                      return (
                        <div
                          key={data.id}
                          className={classes.listCategoryChildren}
                          onClick={() => selectCategory(data.id, data.name, 'income')}
                        >
                          <Typography>
                            {data.name}
                          </Typography>
                          {data.id === record.category && <Check className={classes.checkIcon} />}
                        </div>
                      )
                    })}
                  </div>
                  <Divider />
                </div>
              )
            })}
          </TabPanel>
        </Paper>
        <DialogActions>
          <Button
            variant="text"
            color="primary"
            onClick={() => setOpen(false)}
          >
            CANCEL
          </Button>
          <Button
            autoFocus
            variant="contained"
            color="primary"
            onClick={() => setOpen(false)}
          >
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const selectRecord = (selectedRecord) => {
    setRecord({
      id: selectedRecord.id,
      type: selectedRecord.type,
      amount: Number(selectedRecord.amount),
      category: selectedRecord.category.id,
      categoryName: selectedRecord.category.name,
      transactionDate: selectedRecord.transactionDate,
      note: selectedRecord.note,
    })
  }

  const changeTransactionTab = (newIndex) => {
    if (newIndex === 0) {
      setStartDate(moment(startDate).subtract(1, 'months').startOf('month').format('YYYY-MM-DD'))
      setEndDate(moment(endDate).subtract(1, 'months').endOf('month').format('YYYY-MM-DD'))
    } else if (newIndex === 1) {
      setStartDate(moment().startOf('month').format('YYYY-MM-DD'))
      setEndDate(moment().endOf('month').format('YYYY-MM-DD'))
    } else if (newIndex === 2) {
      setStartDate(moment(startDate).add(1, 'months').format('YYYY-MM-DD'))
      setEndDate(moment(endDate).add(1, 'months').format('YYYY-MM-DD'))
    }
    setTransactionTabIndex(1)
  }

  const handleSearch = () => {
    setStartDate(moment([year, month]).startOf('month').format('YYYY-MM-DD'))
    setEndDate(moment([year, month]).endOf('month').format('YYYY-MM-DD'))
  }

  const isCurrentMonth = TODAY.format('YYYY-MM') === moment(startDate).format('YYYY-MM')

  const thisMonth = () => {
    if (isCurrentMonth) return 'BULAN INI'
    return moment(startDate).format('MMM YYYY')
  }

  const lastMonth = () => {
    if (isCurrentMonth) return 'BULAN LALU'
    return moment(startDate).subtract(1, 'months').format('MMM YYYY')
  }

  const future = () => {
    if (isCurrentMonth) return 'BULAN DEPAN'
    return moment(startDate).add(1, 'months').format('MMM YYYY')
  }

  const renderTransactionHistory = () => {
    return (
      <div className={classes.transactionHistoryContainer}>
        <div className={classes.title}>
          <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          >
            <Typography>
              Riwayat Transaksi
            </Typography>
            <div>
              <FormControl style={{ width: '7.5rem', height: '2rem', marginRight: '1rem' }}>
                <InputLabel>
                  Bulan
                </InputLabel>
                <Select
                  onChange={(event) => setMonth(event.target.value)}
                  value={month}
                >
                  {MONTHS.map(menuMonth => (
                    <MenuItem key={menuMonth.key} value={menuMonth.key}>
                      {menuMonth.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl style={{ width: '5rem' }}>
                <InputLabel>
                  Tahun
                </InputLabel>
                <Select
                  onChange={(event) => setYear(event.target.value)}
                  value={year}
                >
                  {YEARS.map(menuYear => (
                    <MenuItem key={menuYear} value={menuYear}>
                      {menuYear}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <IconButton
                onClick={handleSearch}
                color="primary"
                aria-label="search"
              >
                <Search />
              </IconButton>
            </div>
          </div>
        </div>
        <div>
          <AppBar position="static" color="transparent">
            <Tabs
              value={transactionTabIndex}
              variant="fullWidth"
              onChange={(event, newIndex) => changeTransactionTab(newIndex)}
            >
              <Tab label={lastMonth()} />
              <Tab label={thisMonth()} />
              <Tab label={future()} />
            </Tabs>
          </AppBar>
          <TabPanel
            index={1}
            value={transactionTabIndex}
          >
            <div>
              {renderBalance()}
              <div>
                {recordList.data && recordList.data.map((group) => {
                  return (
                    <div key={group.date}>
                      <div>
                        {moment(group.date).format('DD MMMM YYYY')}
                      </div>
                      <Divider />
                      {group.records.map((recordData) => {
                        return (
                          <div
                            key={recordData.id}
                            className={classNames(classes.recordList, {
                              [classes.selectedRecord]: recordData.id === record.id,
                            })}
                            onClick={() => selectRecord(recordData)}
                          >
                            <div className={classes.transactionDetail}>
                              <div style={{ flex: 1 }}>
                                <div className={classes.transactionRecord}>
                                  <Typography>
                                    {recordData.category.name}
                                  </Typography>
                                  <Typography>
                                    {recordData.type === 'expense' ? `-${formatNumber(recordData.amount)}` : formatNumber(recordData.amount)}
                                  </Typography>
                                </div>
                              </div>
                            </div>
                            <Typography className={classes.transactionNote}>
                              {recordData.note}
                            </Typography>
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          Hi, {user ? user.name : ''} <ArrowDropDown />
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <MenuItem>
            <LogoutButton />
          </MenuItem>
        </Menu>
      </div>
      <div className={classes.content}>
        {renderTransactionForm()}
        {renderTransactionHistory()}
      </div>
      {renderCategoryDialog()}
      {renderDeleteDialog()}
    </div>
  )
}

export default Record
