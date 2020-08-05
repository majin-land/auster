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
  DialogContentText,
  DialogActions,
  FormControlLabel,
  RadioGroup,
  Radio,
  Tabs,
  Tab,
} from '@material-ui/core'
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos'
import { KeyboardDatePicker } from '@material-ui/pickers'

import TabPanel from './tabpanel'
import LogoutButton from '~/src/components/logout'


import styles from './styles'

const useStyles = makeStyles(styles)

const Record = () => {
  const classes = useStyles()

  const [open, setOpen] = useState(false)
  const [amount, setAmount] = useState(0)
  const [transactionDate, setTransactionDate] = useState(moment())
  const [note, setNote] = useState('')
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  const renderCurrentBalance = () => {
    return (
      <div style={{
        border: '1px black solid',
        padding: '0.5rem',
        borderRadius: '5px',
      }}>
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
              label="Select Category"
              type="text"
              disabled
              variant="outlined"
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
          <DialogContentText id="alert-dialog-description">
            {renderCategoryTabPanel()}
          </DialogContentText>
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
    <div>
      <div>
        <Tabs
          variant="fullWidth"
          textColor="primary"
          indicatorColor="primary"
          value={activeTabIndex}
          onChange={(newIndex) => setActiveTabIndex(newIndex)}
          aria-label="simple tabs example"
        >
          <Tab label={'EXPENSE'} {...a11yProps(0)} />
          <Tab label={'INCOME'} {...a11yProps(1)} />
        </Tabs>
      </div>
      <TabPanel value={activeTabIndex} index={0}>
        <FormControl component="fieldset">
          <RadioGroup name="expense" onChange={() => {}}>
            <FormControlLabel value="electricity" control={<Radio />} label="electricity" />
            <FormControlLabel value="internet" control={<Radio />} label="internet" />
          </RadioGroup>
        </FormControl>
      </TabPanel>
      <TabPanel value={activeTabIndex} index={1}>
        <FormControl component="fieldset">
          <RadioGroup name="income" onChange={() => {}}>
            <FormControlLabel value="electricity" control={<Radio />} label="electricity" />
            <FormControlLabel value="internet" control={<Radio />} label="internet" />
          </RadioGroup>
        </FormControl>
        <div style={{ padding: '1rem', textAlign: 'right' }}>
          <Button>
            OK
          </Button>
        </div>
      </TabPanel>
    </div>
  }

  return (
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
  )
}

export default Record
