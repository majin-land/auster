import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classNames from 'classnames'
import moment from 'moment'
import { Search } from '@material-ui/icons'
import {
  IconButton,
  FormControl,
  Tabs,
  Tab,
  AppBar,
  Divider,
  Typography,
  MenuItem,
  InputLabel,
  Select,
} from '@material-ui/core'

import { formatNumber } from 'site/utils/helper'

import TabPanel from 'site/components/tab-panel'

import styles from './styles'

const ASSET_URL = process.env.ASSET_URL

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

const useStyles = makeStyles(styles)

const TransactionList = (props) => {
  const classes = useStyles()
  const {
    recordList,
    month,
    setMonth,
    year,
    setYear,
    handleSearch,
    transactionTabIndex,
    changeTransactionTab,
    selectRecord,
    startDate,
    record,
  } = props

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
                      const name = recordData.category.name
                      const removeSpecialChar = name.replace(/[^\w\s]/gi, '')
                      const iconName = removeSpecialChar.replace(' ', '_').replace(' ', '').toLowerCase()
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
                                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                                  <img
                                    src={`${ASSET_URL}/assets/icons/${iconName}.png`}
                                    className={classes.categoryIcon}
                                  />
                                  <Typography>
                                    {recordData.category.name}
                                  </Typography>
                                </div>
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

export default TransactionList
