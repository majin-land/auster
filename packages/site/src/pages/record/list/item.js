import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import clsx from 'clsx'
import {
  Paper,
  Typography,
} from '@material-ui/core'

import { ASSET_URL } from 'site/config'
import { formatNumber, categoryIconName } from 'site/utils/helper'
import { useGlobalState, DEFAULT_RECORD } from 'site/state'

import styles from './styles'

const useStyles = makeStyles(styles)

const RecordListItem = (props) => {
  const classes = useStyles()
  const [selectedRecord, selectRecord] = useGlobalState('selectedRecord')
  const { record } = props
  const isExpense = record.type === 'expense'
  return (
    <Paper
      key={record.id}
      className={clsx(classes.recordItem, {
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

export default RecordListItem
