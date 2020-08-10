import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
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
  FormControlLabel,
  RadioGroup,
  Radio,
  Tabs,
  Tab,
  AppBar,
  Divider,
  Typography,
} from '@material-ui/core'

import { useRequest } from 'site/hooks'
import { fetchCategory } from 'site/services'

import LogoutButton from 'site/components/logout'

import TabPanel from './tabpanel'

import styles from './styles'

const useStyles = makeStyles(styles)

const Record = () => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [record, setRecord] = useState({
    amount: 0,
    category: null,
    transactionDate: moment(),
    note: '',
  })
  const [recordList, setRecordList] = useState([])
  const [categoryTabIndex, setCategoryTabIndex] = useState(0)
  const [transactionTabIndex, setTransactionTabIndex] = useState(1)

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

  useEffect(() => {
    fetchData()
  }, [])

  const renderCurrentBalance = () => {
    return (
      <div className={classes.currentBalance}>
        <div className={classes.title}>
          Current Balance
        </div>
        <div>
          <div className={classes.currentBalanceInfo}>
            <div>
              Inflow
            </div>
            <div>
              10.000.000
            </div>
          </div>
          <div className={classes.currentBalanceInfo}>
            <div>
              Outflow
            </div>
            <div>
              -3.600.000
            </div>
          </div>
          <div className={classes.currentBalanceInfo}>
            <div>
              Cash
            </div>
            <div>
              6.400.000
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderTransactionForm = () => {
    return (
      <div>
        <div className={classes.title}>
          Add Transaction
        </div>
        <form>
          <FormControl fullWidth style={{ marginBottom: '1rem' }}>
            <TextField
              label="Amount"
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
              placeholder="Select Category"
              type="text"
              disabled
              variant="outlined"
              value={record.category || ''}
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
              label="Note"
              multiline
              rows="4"
              margin="normal"
              name="note"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => {}}
              style={{ color: 'white', fontWeight: 'bold' }}
            >
              Add
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
          {categoryList.map((index, category) => {
            if (category.type === "expense") {
              <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography>
                  {category.name}
                </Typography>
                <Check style={{ color: '#6557b5' }}/>
              </div>
            }
          })}
        </TabPanel>
        <TabPanel value={categoryTabIndex} index={1}>
          {categoryList.map((index, category) => {
            if (category.type === "income") {
              <div key={index} style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                <Typography>
                  {category.name}
                </Typography>
                <Check style={{ color: '#6557b5' }}/>
              </div>
            }
          })}
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

  const renderTransactionHistory = () => {
    return (
      <div>
        <div className={classes.title}>
          Transaction History
        </div>
        <div>
          <AppBar position="static" color="default">
            <Tabs
              value={transactionTabIndex}
              variant="fullWidth"
              onChange={(event, newIndex) => setTransactionTabIndex(newIndex)}
              aria-label="simple tabs example"
            >
              <Tab label="LAST MONTH" {...a11yProps(0)} />
              <Tab label="THIS MONTH" {...a11yProps(1)} />
              <Tab label="FUTURE" {...a11yProps(2)} />
            </Tabs>
          </AppBar>
          <TabPanel value={transactionTabIndex} index={0}>
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
          </TabPanel>
          <TabPanel value={transactionTabIndex} index={1}>
            <div>
              <div>
                29 Agustus 2020
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
          </TabPanel>
          <TabPanel value={transactionTabIndex} index={2}>
            <div>
              <div>
                1 September 2020
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
          </TabPanel>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      {console.log(categoryList)}
      <div className={classes.container}>
        <div className={classes.header}>
          <LogoutButton />
        </div>
        <div className={classes.content}>
          <div className={classes.leftContent}>
            {renderCurrentBalance()}
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
