import React, { useState, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import moment from 'moment'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { Lens, Check } from '@material-ui/icons'
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
  const history = useHistory()

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
  const [recordList, setRecordList] = useState([])
  const [categoryTabIndex, setCategoryTabIndex] = useState(0)
  const [transactionTabIndex, setTransactionTabIndex] = useState(1)
  const [anchorEl, setAnchorEl] = useState(null)
  const [startDate, setStartDate] = useState(moment().format('YYYY-MM-DD'))
  const [endDate, setendDate] = useState(moment().format('YYYY-MM-DD'))

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
    setRecordList(response.data.rows)
    console.log(response)
  }

  useEffect(() => {
    fetchData()
    fetchRecordData(startDate, endDate)
  }, [])

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
              10.000.000
            </div>
          </div>
          <div className={classes.currentBalanceInfo}>
            <div>
              Pengeluaran
            </div>
            <div>
              -3.600.000
            </div>
          </div>
          <div className={classes.currentBalanceInfo}>
            <div>
              Total Saldo
            </div>
            <div>
              6.400.000
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
              value={record.amount}
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
      setRecord({ ...record, type, category: null, categoryName: '' })
    } else {
      setRecord({ ...record, category: id, categoryName: name })
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
      category: null,
      categoryName: '',
      transactionDate: record.transactionDate,
      note: record.note,
    })
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
              onChange={(event, newIndex) => setTransactionTabIndex(newIndex)}
              aria-label="simple tabs example"
            >
              <Tab label="BULAN LALU" {...a11yProps(0)} />
              <Tab label="BULAN INI" {...a11yProps(1)} />
              <Tab label="BULAN DEPAN" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={transactionTabIndex} index={0}>
            <div>
              {renderBalance()}
              <div>
                <div>
                  29 July 2020
                </div>
                <Divider />
                <div className={classes.transactionDetail}>
                  <Lens />
                  <div style={{ flex: 1 }}>
                    <div className={classes.transactionRecord}>
                      <span>Electricity</span>
                      <span>Rp 3.000.000</span>
                    </div>
                    <div className={classes.transactionNote}>
                      ini adalah note untuk outcome
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabPanel>
          <TabPanel value={transactionTabIndex} index={1}>
            <div>
              {renderBalance()}
              <div>
                {recordList.map((recordData) => {
                  return (
                    <div>
                      <div>
                        {moment(recordData.transactionDate).format('DD MMMM YYYY')}
                      </div>
                      <Divider />
                      <div className={classNames(classes.recordList, {
                                [classes.selectedRecord]: recordData.id === record.id,
                              })
                        } onClick={() => selectRecord(recordData)}>
                        <div className={classes.transactionDetail}>
                          <Lens />
                          <div style={{ flex: 1 }}>
                            <div className={classes.transactionRecord}>
                              <span>{recordData.categoryId}</span>
                              <span>{recordData.amount}</span>
                            </div>
                          </div>
                        </div>
                        <div className={classes.transactionNote}>
                          {recordData.note}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </TabPanel>
          <TabPanel value={transactionTabIndex} index={2}>
            <div>
              {renderBalance()}
              <div>
                <div>
                  29 September 2020
                </div>
                <Divider />
                <div className={classes.transactionDetail}>
                  <Lens />
                  <div style={{ flex: 1 }}>
                    <div className={classes.transactionRecord}>
                      <span>Electricity</span>
                      <span>Rp 3.000.000</span>
                    </div>
                    <div className={classes.transactionNote}>
                      ini adalah note untuk outcome
                    </div>
                  </div>
                </div>
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
