import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Check } from '@material-ui/icons'
import {
  Button,
  Dialog,
  Paper,
  DialogActions,
  Tabs,
  Tab,
  AppBar,
  Divider,
  Typography,
} from '@material-ui/core'

import { ASSET_URL } from 'site/config'
import { categoryIconName } from 'site/utils/helper'
import { fetchCategory } from 'site/services'

import TabPanel from 'site/components/tab-panel'

import styles from './styles'

const useStyles = makeStyles(styles)

const CategoryDialog = (props) => {
  const classes = useStyles()

  const [categoryList, setCategoryList] = useState([])
  const [categoryTabIndex, setCategoryTabIndex] = useState(0)

  useEffect(() => {
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
    fetchData()
  }, [])

  const renderCategory = (list, sub = false) => {
    return list.map((category) => {
      return (
        <div key={category.id}>
          <div
            className={classes.categoryListItem}
            onClick={() => props.onSelectCategory(category)}
          >
            <img
              src={`${ASSET_URL}/assets/icons/${categoryIconName(category.name)}.png`}
              className={classes.categoryIcon}
              alt={category.name}
            />
            <Typography style={{ flex: 1 }}>
              {category.name}
            </Typography>
            {props.selectedCategory && category.id === props.selectedCategory.id && (
              <Check className={classes.checkIcon} />
            )}
          </div>
          {category.children && category.children.length > 0 && (
            <div className={classes.subCategoryContainers}>
              {renderCategory(category.children, true)}
            </div>
          )}
          {!sub && <Divider className={classes.divider} />}
        </div>
      )
    })
  }

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
    >
      <AppBar position="static">
        <Tabs
          value={categoryTabIndex}
          onChange={(event, newIndex) => setCategoryTabIndex(newIndex)}
        >
          <Tab label="EXPENSE" />
          <Tab label="INCOME" />
        </Tabs>
      </AppBar>
      <Paper style={{ overflowY: 'auto' }}>
        <TabPanel value={categoryTabIndex} index={0}>
          {renderCategory(categoryList.filter(cat => cat.type === 'expense'))}
        </TabPanel>
        <TabPanel value={categoryTabIndex} index={1}>
          {renderCategory(categoryList.filter(cat => cat.type === 'income'))}
        </TabPanel>
      </Paper>
      <DialogActions>
        <Button
          variant="text"
          color="primary"
          onClick={props.onClose}
        >
          CANCEL
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CategoryDialog
