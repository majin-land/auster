import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { ArrowDropDown } from '@material-ui/icons'
import {
  Button,
  Menu,
  MenuItem,
  // FormControl,
  AppBar,
  Tabs,
  Tab,
  // Select,
  // InputLabel,
  // Typography,
} from '@material-ui/core'

import { useGlobalState, DEFAULT_RECORD } from 'site/state'
import { addRecord, fetchRecord, deleteRecord, updateRecord } from 'site/services'

import LogoutButton from 'site/components/logout'
import TabPanel from 'site/components/tab-panel'

import RecordForm from './form'
import RecordList from './list'

import styles from './styles'

const useStyles = makeStyles(styles)

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

const Record = () => {
  const classes = useStyles()

  const [user] = useGlobalState('user')
  const [, selectRecord] = useGlobalState('selectedRecord')

  const [recordList, setRecordList] = useState([])
  const [transactionTabIndex, setTransactionTabIndex] = useState(1)
  const [anchorEl, setAnchorEl] = useState(null)
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'))
  // const [month, setMonth] = useState(moment(startDate).subtract(1, 'months').format('M'))
  // const [year, setYear] = useState(moment(endDate).format('YYYY'))

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const fetchRecordData = async (start, end) => {
    const response = await fetchRecord({ startDate: start, endDate: end })
    setRecordList(response.data)
  }

  const handleCancel = () => {
    selectRecord(DEFAULT_RECORD)
  }

  const handleSubmit = async (record) => {
    let response = null
    if (record.id) {
      response = await updateRecord(record)
    } else {
      response = await addRecord(record)
    }
    if (response.ok) {
      fetchRecordData(startDate, endDate)
      handleCancel()
    }
  }

  const handleDelete = async (record) => {
    const response = await deleteRecord(record.id)
    if (response.ok) {
      fetchRecordData(startDate, endDate)
      handleCancel()
    }
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

  useEffect(() => {
    fetchRecordData(startDate, endDate)
  }, [startDate, endDate])

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Button
          aria-haspopup="true"
          onClick={handleClick}
        >
          Hi, {user ? user.name : ''} <ArrowDropDown />
        </Button>
        <Menu
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
        <RecordForm
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onDelete={handleDelete}
        />
        <div className={classes.transactionHistoryContainer}>
          {/* <div style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          >
            <Typography>
              Riwayat Transaksi
            </Typography>
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
          </div> */}
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
            <RecordList
              list={recordList}
            />
          </TabPanel>
        </div>
      </div>
    </div>
  )
}

export default Record
