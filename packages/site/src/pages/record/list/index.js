import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import moment from 'moment'
import {
  Divider,
  Paper,
  Typography,
} from '@material-ui/core'

import { ASSET_URL } from 'site/config'
import { formatNumber, categoryIconName } from 'site/utils/helper'
import { useGlobalState, DEFAULT_RECORD } from 'site/state'

import styles from './styles'

const useStyles = makeStyles(styles)

const TransactionList = (props) => {
  const classes = useStyles()

  const [selectedRecord, selectRecord] = useGlobalState('selectedRecord')

  const { list } = props

  const renderBalance = () => {
    return (
      <div className={classes.currentBalance}>
        <div className={classes.currentBalanceInfo}>
          <Typography>
            Pemasukan
          </Typography>
          <Typography>
            {formatNumber(list.income || 0)}
          </Typography>
        </div>
        <div className={classes.currentBalanceInfo}>
          <Typography>
            Pengeluaran
          </Typography>
          <Typography>
            -{formatNumber(list.expense || 0)}
          </Typography>
        </div>
        <div className={classes.currentBalanceInfo}>
          <Typography>
            Total Saldo
          </Typography>
          <Typography>
            {(formatNumber(list.income - list.expense) || 0)}
          </Typography>
        </div>
      </div>
    )
  }

  const renderRecord = (record) => {
    const isExpense = record.type === 'expense'
    return (
      <Paper
        key={record.id}
        className={classnames(classes.recordItem, {
          [classes.selectedRecord]: record.id === selectedRecord.id,
          [classes.normalRecord]: record.id !== selectedRecord.id,
        })}
        onClick={() => {
          if (selectedRecord.id === record.id) {
            selectRecord(DEFAULT_RECORD)
          } else {
            selectRecord(record)
          }
        }}
      >
        <div className={classes.transactionRecord}>
          <img
            src={`${ASSET_URL}/assets/icons/${categoryIconName(record.category.name)}.png`}
            className={classes.categoryIcon}
            alt={record.category.name}
          />
          <Typography className={classes.recordLabel}>
            {record.category ? record.category.name : record.type}
          </Typography>
          <Typography>
            {isExpense && '-'}{formatNumber(record.amount)}
          </Typography>
        </div>
        <Typography className={classes.transactionNote}>
          {record.note}
        </Typography>
      </Paper>
    )
  }

  const renderGroup = (group) => {
    return (
      <div
        key={group.date}
        className={classes.recordGroup}
      >
        <Typography className={classes.recordDate}>
          {moment(group.date).format('DD MMMM YYYY')}
        </Typography>
        <Divider />
        {group.records.map(renderRecord)}
      </div>
    )
  }

  return (
    <div>
      {renderBalance()}
      {list.data && list.data.map(renderGroup)}
    </div>
  )
}

export default TransactionList
