import React from 'react'
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

import TabPanel from 'site/components/tab-panel'

import styles from './styles'

const ASSET_URL = process.env.ASSET_URL

const useStyles = makeStyles(styles)

const CategoryDialog = (props) => {
  const classes = useStyles()

  const {
    open,
    setOpen,
    setCategoryTabIndex,
    categoryTabIndex,
    categoryList,
    selectCategory,
    record,
  } = props

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
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
          {categoryList.map((category) => {
            if (category.type !== 'expense') return null
            const name = category.name
            const removeSpecialChar = name.replace(/[^\w\s]/gi, '')
            const iconName = removeSpecialChar.replace(' ', '_').replace(' ', '').toLowerCase()
            return (
              <div key={category.id}>
                <div
                  className={classes.listCategory}
                  onClick={() => selectCategory(category.id, category.name, 'expense')}
                >
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                    <img
                      src={`${ASSET_URL}/assets/icons/${iconName}.png`}
                      className={classes.categoryIcon}
                    />
                    <Typography>
                      {category.name}
                    </Typography>
                  </div>
                  {category.id === record.category && <Check className={classes.checkIcon} />}
                </div>
                <div>
                  {category.children &&
                    category.children.map((data) => {
                      const childName = data.name
                      const removeChildSpecialChar = childName.replace(/[^\w\s]/gi, '')
                      const childIconName = removeChildSpecialChar.replace(' ', '_').replace(' ', '').toLowerCase()
                      return (
                        <div
                          key={data.id}
                          className={classes.listCategoryChildren}
                          onClick={() => selectCategory(data.id, data.name, 'expense')}
                        >
                          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <img
                              src={`${ASSET_URL}/assets/icons/${childIconName}.png`}
                              className={classes.categoryIcon}
                            />
                            <Typography>
                              {data.name}
                            </Typography>
                          </div>
                          {data.id === record.category && <Check className={classes.checkIcon} />}
                        </div>
                      )
                    })}
                </div>
                <Divider />
              </div>
            )
          })}
        </TabPanel>
        <TabPanel value={categoryTabIndex} index={1}>
          {categoryList.map((category) => {
            if (category.type !== 'income') return null
            return (
              <div key={category.id}>
                <div
                  className={classes.listCategory}
                  onClick={() => selectCategory(category.id, category.name, 'income')}
                >
                  <Typography>
                    {category.name}
                  </Typography>
                  {category.id === record.category && <Check className={classes.checkIcon} />}
                </div>
                <div>
                  {category.children &&
                  category.children.map((data) => {
                    return (
                      <div
                        key={data.id}
                        className={classes.listCategoryChildren}
                        onClick={() => selectCategory(data.id, data.name, 'income')}
                      >
                        <Typography>
                          {data.name}
                        </Typography>
                        {data.id === record.category && <Check className={classes.checkIcon} />}
                      </div>
                    )
                  })}
                </div>
                <Divider />
              </div>
            )
          })}
        </TabPanel>
      </Paper>
      <DialogActions>
        <Button
          variant="text"
          color="primary"
          onClick={() => setOpen(false)}
        >
          CANCEL
        </Button>
        <Button
          autoFocus
          variant="contained"
          color="primary"
          onClick={() => setOpen(false)}
        >
          OK
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CategoryDialog
