import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import moment from 'moment'
import { ArrowDropDown } from '@material-ui/icons'
import {
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core'

import { useRequest } from 'site/hooks'
import { useGlobalState } from 'site/state'
import { fetchCategory, addRecord, fetchRecord, deleteRecord, updateRecord } from 'site/services'

import LogoutButton from 'site/components/logout'
import ConfirmDialog from 'site/components/confirm-dialog'

import TransactionForm from './form'
import CategoryDialog from './category'
import TransactionList from './list'

import styles from './styles'

const DEFAULT_RECORD = {
  id: '',
  type: 'expense',
  amount: '',
  category: null,
  categoryName: '',
  transactionDate: moment(),
  note: '',
}

const useStyles = makeStyles(styles)

const Record = () => {
  const classes = useStyles()

  const { request: submitRecord } = useRequest(addRecord)
  const [user] = useGlobalState('user')

  const [open, setOpen] = useState(false)
  const [categoryList, setCategoryList] = useState([])
  const [record, setRecord] = useState(DEFAULT_RECORD)
  const [recordList, setRecordList] = useState({})
  const [categoryTabIndex, setCategoryTabIndex] = useState(0)
  const [transactionTabIndex, setTransactionTabIndex] = useState(1)
  const [anchorEl, setAnchorEl] = useState(null)
  const [startDate, setStartDate] = useState(moment().startOf('month').format('YYYY-MM-DD'))
  const [endDate, setEndDate] = useState(moment().endOf('month').format('YYYY-MM-DD'))
  const [month, setMonth] = useState(moment(startDate).subtract(1, 'months').format('M'))
  const [year, setYear] = useState(moment(endDate).format('YYYY'))
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState(false)

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

  const fetchRecordData = async (start, end) => {
    const response = await fetchRecord({ startDate: start, endDate: end })
    setRecordList(response.data)
  }

  useEffect(() => {
    fetchRecordData(startDate, endDate)
    fetchData()
  }, [])

  useEffect(() => {
    fetchRecordData(startDate, endDate)
  }, [startDate, endDate])

  const handleCancel = () => {
    setRecord(DEFAULT_RECORD)
  }

  const handleSubmit = async (recordData) => {
    let response = null
    if (recordData.id) {
      response = await updateRecord(recordData)
    } else {
      response = await submitRecord(recordData)
    }
    if (response.ok) {
      fetchRecordData(startDate, endDate)
      handleCancel()
    }
  }

  const handleDelete = async (id) => {
    const response = await deleteRecord(id)
    if (response.ok) {
      handleCancel()
      setDeleteConfirmDialog(false)
      fetchRecordData(startDate, endDate)
    }
  }

  const renderDeleteDialog = () => {
    return (
      <ConfirmDialog
        open={deleteConfirmDialog}
        title="Konfirmasi Hapus"
        content="Hapus transaksi ini ?"
        onClose={() => setDeleteConfirmDialog(false)}
        onAccept={() => handleDelete(record.id)}
      />
    )
  }

  const selectCategory = (id, name, type) => {
    if (id === record.category) {
      setRecord({ ...record, type: 'expense', category: null, categoryName: '' })
    } else {
      setRecord({ ...record, type, category: id, categoryName: name })
    }
    setOpen(false)
  }

  const selectRecord = (selectedRecord) => {
    setRecord({
      id: selectedRecord.id,
      type: selectedRecord.type,
      amount: Number(selectedRecord.amount),
      category: selectedRecord.category.id,
      categoryName: selectedRecord.category.name,
      transactionDate: selectedRecord.transactionDate,
      note: selectedRecord.note,
    })
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

  const handleSearch = () => {
    setStartDate(moment([year, month]).startOf('month').format('YYYY-MM-DD'))
    setEndDate(moment([year, month]).endOf('month').format('YYYY-MM-DD'))
  }

  return (
    <div className={classes.container}>
      <div className={classes.header}>
        <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
          Hi, {user ? user.name : ''} <ArrowDropDown />
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
        <TransactionForm
          record={record}
          setRecord={setRecord}
          handleSubmit={handleSubmit}
          setOpen={setOpen}
          handleCancel={handleCancel}
          setDeleteConfirmDialog={setDeleteConfirmDialog}
        />
        <TransactionList
          record={record}
          recordList={recordList}
          month={month}
          setMonth={setMonth}
          year={year}
          setYear={setYear}
          handleSearch={handleSearch}
          transactionTabIndex={transactionTabIndex}
          changeTransactionTab={changeTransactionTab}
          selectRecord={selectRecord}
          startDate={startDate}
        />
      </div>
      <CategoryDialog
        open={open}
        setOpen={setOpen}
        setCategoryTabIndex={setCategoryTabIndex}
        categoryTabIndex={categoryTabIndex}
        categoryList={categoryList}
        selectCategory={selectCategory}
        record={record}
      />
      {renderDeleteDialog()}
    </div>
  )
}

export default Record
