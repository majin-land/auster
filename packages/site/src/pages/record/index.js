import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import moment from 'moment'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { Lens, Check, Search } from '@material-ui/icons'
import { KeyboardDatePicker } from '@material-ui/pickers'
import {
  TextField,
  InputAdornment,
  IconButton,
  Button,
  FormControl,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tabs,
  Tab,
  AppBar,
  Divider,
  Typography,
  Menu,
  MenuItem,
  InputLabel,
  Select
} from '@material-ui/core'

import { useRequest } from 'site/hooks'
import { useGlobalState } from 'site/state'
import { fetchCategory, addRecord, fetchRecord, deleteRecord, updateRecord } from 'site/services'

import LogoutButton from 'site/components/logout'

import TabPanel from './tabpanel'

import styles from './styles'

const useStyles = makeStyles(styles)

const Record = () => {
  const classes = useStyles()

  const { isLoading, request: submitRecord } = useRequest(addRecord)
  const [user, ] = useGlobalState('user')

  const [open, setOpen] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [record, setRecord] = useState({
    id: '',
    type: 'expense',
    amount: 0,
    category: null,
    categoryName: '',
    transactionDate: moment(),
    note: '',
  })
  const [recordList, setRecordList] = useState({})
  const [categoryTabIndex, setCategoryTabIndex] = useState(0)
  const [transactionTabIndex, setTransactionTabIndex] = useState(1)
  const [anchorEl, setAnchorEl] = useState(null)
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'))
  const [month, setMonth] = useState(moment().subtract(1, 'months').format('M'))
  const [year, setYear] = useState(moment().subtract(1, 'months').format('YYYY'))
  const [confirmDialog, setConfirmDialog] = useState(false)

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

  const fetchRecordData = async (startDate, endDate) => {
    const response = await fetchRecord({ startDate, endDate })
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
        <div className={classes.title}>
          Saldo
        </div>
        <div>
          <div className={classes.currentBalanceInfo}>
            <div>
              Pemasukan
            </div>
            <div>
              {recordList.income || 0}
            </div>
          </div>
          <div className={classes.currentBalanceInfo}>
            <div>
              Pengeluaran
            </div>
            <div>
              -{recordList.expense || 0}
            </div>
          </div>
          <div className={classes.currentBalanceInfo}>
            <div>
              Total Saldo
            </div>
            <div>
              {(recordList.income - recordList.expense) || 0}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (record) => {
    let response = null
    if (record.id) {
      response = await updateRecord(record)
    } else {
      response = await submitRecord(record)
    }
    if (response.ok) {
      fetchRecordData(startDate, endDate)
      handleCancel()
    }
  }

  const handleCancel = () => {
    setRecord({
      id: '',
      type: 'expense',
      amount: 0,
      category: null,
      categoryName: '',
      transactionDate: moment(),
      note: '',
    })
  }

  const handleDelete = async (id) => {
    const response = await deleteRecord(id)
    if (response.ok) {
      handleCancel()
      fetchRecordData(startDate, endDate)
    }
  }

  const renderTransactionForm = () => {
    return (
      <div>
        <div className={classes.title}>
          {record.id ? 'Detail Transaksi' : 'Tambah Transaksi'}
        </div>
        <form>
          <FormControl fullWidth style={{ marginBottom: '1rem' }}>
            <TextField
              label="Jumlah"
              value={Number(record.amount)}
              onChange={(event) => setRecord({ ...record, amount: event.target.value })}
              type="text"
              name="amount"
              required
            />
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '1rem' }}>
            <TextField
              onClick={() => setOpen(true)}
              placeholder="Pilih Kategori"
              type="text"
              disabled
              variant="outlined"
              value={record.categoryName}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setOpen(true)}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '1rem' }}>
            <KeyboardDatePicker
              margin="normal"
              id="date-picker-dialog"
              label="Date picker dialog"
              format="MM/dd/yyyy"
              variant="inline"
              inputVariant="filled"
              value={record.transactionDate}
              onChange={(date) => setRecord({ ...record, transactionDate: date })}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </FormControl>
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
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            {record.id &&
              <Button
                variant="contained"
                size="large"
                color="secondary"
                onClick={() => handleCancel()}
                style={{ color: 'white', fontWeight: 'bold' }}
              >
                Batal
              </Button>
            }
            {record.id &&
              <Button
                variant="contained"
                size="large"
                onClick={() => handleDelete(record.id)}
                className={classes.deleteButton}
              >
                Hapus
              </Button>
            }
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => handleSubmit(record)}
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              {record.id ? 'Ubah' : 'Tambah'}
            </Button>
          </div>
        </form>
      </div>
    )
  }

  const a11yProps = (index) => {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    }
  }

  const selectCategory = (id, name, type) => {
    if (id === record.category) {
      setRecord({ ...record, type: 'expense', category: null, categoryName: '' })
    } else {
      setRecord({ ...record, type, category: id, categoryName: name })
    }
  }

  const renderCategoryTabPanel = () => {
    return (
      <div>
        <AppBar position="static">
          <Tabs value={categoryTabIndex} onChange={(event, newIndex) => setCategoryTabIndex(newIndex)} aria-label="simple tabs example">
            <Tab label="EXPENSE" {...a11yProps(0)} />
            <Tab label="INCOME" {...a11yProps(1)} />
          </Tabs>
        </AppBar>
        <TabPanel value={categoryTabIndex} index={0}>
          <div className={classes.wrapperCategory}>
            {categoryList.map((category) => {
              if (category.type === "expense") {
                return (
                  <div key={category.id}>
                    <div  className={classes.listCategory} onClick={() => selectCategory(category.id, category.name, 'expense')}>
                      <Typography>
                        {category.name}
                      </Typography>
                      {category.id === record.category && <Check className={classes.checkIcon}/>}
                    </div>
                    <div>
                      {category.children &&
                        category.children.map((data) => {
                          return (
                            <div key={data.id} className={classes.listCategoryChildren} onClick={() => selectCategory(data.id, data.name, 'expense')}>
                              <Typography>
                                {data.name}
                              </Typography>
                              {data.id === record.category && <Check className={classes.checkIcon}/>}
                            </div>
                          )
                        })
                      }
                    </div>
                    <Divider/>
                  </div>
                )
              }
            })}
          </div>
        </TabPanel>
        <TabPanel value={categoryTabIndex} index={1}>
        <div className={classes.wrapperCategory}>
          {categoryList.map((category) => {
            if (category.type === "income") {
              return (
                <div key={category.id}>
                  <div className={classes.listCategory} onClick={() => selectCategory(category.id, category.name, 'income')}>
                    <Typography>
                      {category.name}
                    </Typography>
                    {category.id === record.category && <Check className={classes.checkIcon}/>}
                  </div>
                  <div>
                    {category.children &&
                      category.children.map((data) => {
                        return (
                          <div key={data.id} className={classes.listCategoryChildren} onClick={() => selectCategory(data.id, data.name, 'income')}>
                            <Typography>
                              {data.name}
                            </Typography>
                            {data.id === record.category && <Check className={classes.checkIcon}/>}
                          </div>
                        )
                      })
                    }
                  </div>
                  <Divider/>
                </div>
              )
            }
          })}
        </div>
        </TabPanel>
      </div>
    )
  }

  const renderCategoryDialog = () => {
    return (
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Select Category</DialogTitle>
        <DialogContent>
          {renderCategoryTabPanel()}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            CANCEL
          </Button>
          <Button onClick={() => setOpen(false)} color="primary" autoFocus>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    )
  }

  const selectRecord = (record) => {
    setRecord({
      id: record.id,
      type: record.type,
      amount: record.amount,
      category: record.category.id,
      categoryName: record.category.name,
      transactionDate: record.transactionDate,
      note: record.note,
    })
  }

  const changeTransactionTab = (newIndex) => {
    if (newIndex === 0) {
      setStartDate(moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD'))
      setEndDate(moment().subtract(1, 'months').endOf('month').format('YYYY-MM-DD'))
    } else if (newIndex === 1) {
      setStartDate(moment().startOf('month').format('YYYY-MM-DD'))
      setEndDate(moment().endOf('month').format('YYYY-MM-DD'))
    } else if (newIndex === 2) {
      setStartDate(moment().add(1, 'months').format('YYYY-MM-DD'))
      setEndDate(moment().add(1, 'months').format('YYYY-MM-DD'))
    }
    setTransactionTabIndex(newIndex)
  }

  const handleSearch = () => {
    setStartDate(moment([year, month]).startOf('month').format('YYYY-MM-DD'))
    setEndDate(moment([year, month]).endOf('month').format('YYYY-MM-DD'))
  }

  const renderTransactionHistory = () => {
    return (
      <div>
        <div className={classes.title}>
          Riwayat Transaksi
        </div>
        <div>
          <AppBar position="static" color="default">
            <Tabs
              value={transactionTabIndex}
              variant="fullWidth"
              onChange={(event, newIndex) => changeTransactionTab(newIndex)}
              aria-label="simple tabs example"
            >
              <Tab label="BULAN LALU" {...a11yProps(0)} />
              <Tab label="BULAN INI" {...a11yProps(1)} />
              <Tab label="BULAN DEPAN" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={transactionTabIndex} index={0}>
            <div>
              <div style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  {moment(startDate).format('MMMM YYYY')}
                </div>
                <div>
                  <FormControl style={{ width: '7rem', marginRight: '1rem' }}>
                    <InputLabel id="demo-simple-select-label">Bulan</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      onChange={(event) => setMonth(event.target.value)}
                      value={month}
                    >
                      <MenuItem value={0}>Januari</MenuItem>
                      <MenuItem value={1}>Februari</MenuItem>
                      <MenuItem value={2}>Maret</MenuItem>
                      <MenuItem value={3}>April</MenuItem>
                      <MenuItem value={4}>May</MenuItem>
                      <MenuItem value={5}>Juni</MenuItem>
                      <MenuItem value={6}>Juli</MenuItem>
                      <MenuItem value={7}>Agustus</MenuItem>
                      <MenuItem value={8}>September</MenuItem>
                      <MenuItem value={9}>Oktober</MenuItem>
                      <MenuItem value={10}>November</MenuItem>
                      <MenuItem value={11}>Desember</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl style={{ width: '5rem' }}>
                    <InputLabel id="demo-simple-select-label">Tahun</InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      onChange={(event) => setYear(event.target.value)}
                      value={year}
                    >
                      <MenuItem value={2020}>2020</MenuItem>
                      <MenuItem value={2021}>2021</MenuItem>
                      <MenuItem value={2022}>2022</MenuItem>
                    </Select>
                  </FormControl>
                  <IconButton onClick={() => handleSearch()} color="primary" aria-label="search">
                    <Search />
                  </IconButton>
                </div>
              </div>
              {renderBalance()}
              <div>
                {recordList.data && Object.keys(recordList.data).map((key) => {
                    return (
                      <div>
                        <div>
                          {moment(key).format('DD MMMM YYYY')}
                        </div>
                        <Divider />
                        {recordList.data[key].map((recordData) => {
                          return (
                            <div
                              className={classNames(classes.recordList, {
                                [classes.selectedRecord]: recordData.id === record.id,
                              })}
                              onClick={() => selectRecord(recordData)}
                            >
                              <div className={classes.transactionDetail}>
                                <Lens />
                                <div style={{ flex: 1 }}>
                                  <div className={classes.transactionRecord}>
                                    <span>
                                      {recordData.category.name}
                                    </span>
                                    <span>
                                      {recordData.type === 'expense' ? '-' + Number(recordData.amount) : Number(recordData.amount)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className={classes.transactionNote}>
                                {recordData.note}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </TabPanel>
          <TabPanel value={transactionTabIndex} index={1}>
            <div>
              {renderBalance()}
              <div>
                {recordList.data && Object.keys(recordList.data).map((key) => {
                    return (
                      <div>
                        <div>
                          {moment(key).format('DD MMMM YYYY')}
                        </div>
                        <Divider />
                        {recordList.data[key].map((recordData) => {
                          return (
                            <div
                              className={classNames(classes.recordList, {
                                [classes.selectedRecord]: recordData.id === record.id,
                              })}
                              onClick={() => selectRecord(recordData)}
                            >
                              <div className={classes.transactionDetail}>
                                <Lens />
                                <div style={{ flex: 1 }}>
                                  <div className={classes.transactionRecord}>
                                    <span>
                                      {recordData.category.name}
                                    </span>
                                    <span>
                                      {recordData.type === 'expense' ? '-' + Number(recordData.amount) : Number(recordData.amount)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className={classes.transactionNote}>
                                {recordData.note}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </TabPanel>
          <TabPanel value={transactionTabIndex} index={2}>
            <div>
              {renderBalance()}
              <div>
                {recordList.data && Object.keys(recordList.data).map((key) => {
                    return (
                      <div>
                        <div>
                          {moment(key).format('DD MMMM YYYY')}
                        </div>
                        <Divider />
                        {recordList.data[key].map((recordData) => {
                          return (
                            <div
                              className={classNames(classes.recordList, {
                                [classes.selectedRecord]: recordData.id === record.id,
                              })}
                              onClick={() => selectRecord(recordData)}
                            >
                              <div className={classes.transactionDetail}>
                                <Lens />
                                <div style={{ flex: 1 }}>
                                  <div className={classes.transactionRecord}>
                                    <span>
                                      {recordData.category.name}
                                    </span>
                                    <span>
                                      {recordData.type === 'expense' ? '-' + Number(recordData.amount) : Number(recordData.amount)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className={classes.transactionNote}>
                                {recordData.note}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )
                  })
                }
              </div>
            </div>
          </TabPanel>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div className={classes.container}>
        <div className={classes.header}>
          <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
            Hi, {user ? user.name : ''}
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
          <div className={classes.leftContent}>
            {renderTransactionHistory()}
          </div>
          <div className={classes.rightContent}>
            {renderTransactionForm()}
          </div>
        </div>
        {renderCategoryDialog()}
      </div>
    </div>
  )
}

export default Record
