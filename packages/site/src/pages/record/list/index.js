import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import {
  Divider,
  Typography,
} from '@material-ui/core'

import { formatNumber } from 'site/utils/helper'

import RecordListItem from './item'

import styles from './styles'

const useStyles = makeStyles(styles)

const RecordList = (props) => {
  const classes = useStyles()
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
        {group.records.map((record) => (
          <RecordListItem
            key={record.id}
            record={record}
          />
        ))}
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

export default RecordList
