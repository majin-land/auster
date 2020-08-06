import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'

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
  Icons,
} from '@material-ui/core'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import Lens from '@material-ui/icons/Lens'
import { KeyboardDatePicker } from '@material-ui/pickers'

import TabPanel from './tabpanel'
import LogoutButton from '~/src/components/logout'


import styles from './styles'

const useStyles = makeStyles(styles)

const Record = () => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [category, setCategory] = useState(null)
  const [transactionDate, setTransactionDate] = useState(moment())
  const [note, setNote] = useState('')
  const [categoryTabIndex, setCategoryTabIndex] = useState(0)
  const [transactionTabIndex, setTransactionTabIndex] = useState(1)

  const renderCurrentBalance = () => {
    return (
      <div className={classes.currentBalance}>
        <div style={{
            fontWeight: 'bold'
          }}
        >
          Current Balance
        </div>
        <div
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <div>
              Inflow
            </div>
            <div>
              10.000.000
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
            <div>
              Outflow
            </div>
            <div>
              -3.600.000
            </div>
          </div>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
          }}>
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
        <form>
          <FormControl fullWidth style={{ marginBottom: '1rem' }}>
            <TextField
              label="Amount"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
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
              value={category}
              InputProps={{
                endAdornment:
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setOpen(true)}
                    >
                      <ArrowForwardIosIcon />
                    </IconButton>
                  </InputAdornment>
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
              value={transactionDate}
              onChange={(date) => setTransactionDate(date)}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </FormControl>
          <FormControl fullWidth style={{ marginBottom: '1rem' }}>
            <TextField
              fullWidth
              value={note}
              onChange={(event) => setNote(event.target.value)}
              label="Note"
              multiline
              rows="4"
              margin="normal"
              name="note"
              variant="outlined"
              InputLabelProps={{ shrink: true }}
            />
          </FormControl>
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end'
            }}
          >
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

  const categoryDialog = () => {
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
          <FormControl component="fieldset">
            <RadioGroup aria-label="expense" name="expense" value={category} onChange={(event, newValue) => setCategory(newValue)}>
              <FormControlLabel value="Electricity" control={<Radio />} label="Electricity" />
              <FormControlLabel value="Gas" control={<Radio />} label="Gas" />
              <FormControlLabel value="Internet" control={<Radio />} label="Internet" />
              <FormControlLabel value="Phone" control={<Radio />} label="Phone" />
            </RadioGroup>
          </FormControl>
        </TabPanel>
        <TabPanel value={categoryTabIndex} index={1}>
          <FormControl component="fieldset">
            <RadioGroup aria-label="income" name="income" value={category} onChange={(event, newValue) => setCategory(newValue)}>
              <FormControlLabel value="Sallary" control={<Radio />} label="Sallary" />
              <FormControlLabel value="Gift" control={<Radio />} label="Gift" />
              <FormControlLabel value="Award" control={<Radio />} label="Award" />
              <FormControlLabel value="Selling" control={<Radio />} label="Selling" />
            </RadioGroup>
          </FormControl>
        </TabPanel>
      </div>
    )
  }

  const renderTransactionHistory = () => {
    return (
      <div>
        <div style={{
            fontWeight: 'bold',
            marginBottom: '0.5rem',
          }}>
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Lens/>
                <div
                  style={{
                    flex: 1
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1rem',
                    }}
                  >
                    <span>Electricity</span>
                    <span>Rp 3.000.000</span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem'
                    }}
                  >
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Lens/>
                <div
                  style={{
                    flex: 1
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1rem',
                    }}
                  >
                    <span>Electricity</span>
                    <span>Rp 3.000.000</span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem'
                    }}
                  >
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
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Lens/>
                <div
                  style={{
                    flex: 1
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '1rem',
                    }}
                  >
                    <span>Electricity</span>
                    <span>Rp 3.000.000</span>
                  </div>
                  <div
                    style={{
                      fontSize: '0.8rem'
                    }}
                  >
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
    <div style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <div className={classes.container}>
        <div
          style={{
            display: 'flex',
            flex: '1',
            justifyContent: 'flex-end',
            marginBottom: '0.5rem'
          }}
        >
          <LogoutButton />
        </div>
        <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <div style={{
            flex: 1,
            marginRight: '0.5rem',
          }}>
            {renderCurrentBalance()}
            {renderTransactionHistory()}
          </div>
          <div style={{
            flex: 1,
            border: '1px black solid',
            padding: '0.5rem',
            borderRadius: '5px',
          }}>
            <div style={{
                  fontWeight: 'bold',
                  marginBottom: '0.5rem',
              }}
            >
              Add Transaction
            </div>
            {renderTransactionForm()}
          </div>
        </div>
        {categoryDialog()}
      </div>
    </div>
  )
}

export default Record