import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import moment from 'moment'
import {
  Divider,
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
        <Typography className={classes.title}>
          Saldo
        </Typography>
        <div>
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
      </div>
    )
  }

  return (
    <div>
      {renderBalance()}
      <div>
        {list.data && list.data.map((group) => {
          return (
            <div key={group.date}>
              <div>
                {moment(group.date).format('DD MMMM YYYY')}
              </div>
              <Divider />
              {group.records.map((recordData) => {
                return (
                  <div
                    key={recordData.id}
                    className={classnames(classes.recordItem, {
                      [classes.selectedRecord]: recordData.id === selectedRecord.id,
                      [classes.normalRecord]: recordData.id !== selectedRecord.id,
                    })}
                    onClick={() => {
                      console.log(recordData)
                      if (selectedRecord.id === recordData.id) {
                        selectRecord(DEFAULT_RECORD)
                      } else {
                        selectRecord(recordData)
                      }
                    }}
                  >
                    <div className={classes.transactionRecord}>
                      <div className={classes.transactionInfo}>
                        <img
                          src={`${ASSET_URL}/assets/icons/${categoryIconName(recordData.category.name)}.png`}
                          className={classes.categoryIcon}
                          alt={recordData.category.name}
                        />
                        <Typography>
                          {recordData.category.name}
                        </Typography>
                      </div>
                      <Typography>
                        {recordData.type === 'expense' ? `-${formatNumber(recordData.amount)}` : formatNumber(recordData.amount)}
                      </Typography>
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
  )
}

export default TransactionList
