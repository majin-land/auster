const router = require('express').Router()
const moment = require('moment')
const { Op } = require('sequelize')
const { Record, Category } = require('../models')

router.get('/:startDate/:endDate', async (req, res) => {
  const startDate = moment(req.params.startDate)
  const endDate = moment(req.params.endDate)

  const result = await Record.findAll({
    where: {
      userId: req.currentUser.id,
      transactionDate: {
        [Op.lt]: endDate,
        [Op.gt]: startDate,
      },
    },
    include: [
      {
        model: Category,
        as: 'category',
        required: false,
        attributes: ['name'],
      },
    ],
    order: [
      ['transactionDate', 'DESC'],
      ['id', 'DESC'],
    ],
  })

  const { income, expense } = result
    .reduce((total, record) => {
      if (record.type === 'expense') total.expense += record.amount
      if (record.type === 'income') total.income += record.amount
      return total
    }, { income: 0, expense: 0 })

  const data = result.reduce((acc, record) => {
    const key = moment(record.transactionDate).format('YYYY-MM-DD')
    let group = acc.find(recordGroup => recordGroup.date === key)
    if (!group) {
      group = { date: key, records: [] }
      acc.push(group)
    }
    group.records.push(record)
    return acc
  }, [])

  res.json({
    data,
    income,
    expense,
  })
})

router.get('/:id', async (req, res) => {
  const where = {
    id: req.params.id,
    userId: req.currentUser.id,
  }

  const record = await Record.findOne({
    where,
    include: [
      {
        model: Category,
        as: 'category',
        required: false,
      },
    ],
  })

  if (!record) throw new Error('Record not found')

  res.json(record.display())
})

router.post('/', async (req, res) => {
  const { category, amount, transactionDate, note } = req.body

  const cat = await Category.findOne({ where: { id: category.id } })

  const record = await Record.create({
    userId: req.currentUser.id,
    categoryId: category.id,
    type: cat.type,
    amount,
    transactionDate,
    note,
  })

  res.json(record.display())
})

router.put('/:id', async (req, res) => {
  const where = {
    id: req.params.id,
    userId: req.currentUser.id,
  }

  const cat = await Category.findOne({ where: { id: req.body.category.id } })

  const record = await Record.findOne({ where })
  record.type = cat.type
  record.categoryId = req.body.category.id
  record.amount = req.body.amount
  record.transactionDate = req.body.transactionDate
  record.note = req.body.note

  await record.save()

  res.json(record.display())
})

router.delete('/:id', async (req, res) => {
  const where = {
    id: req.params.id,
    userId: req.currentUser.id,
  }

  const record = await Record.findOne({ where })

  await record.destroy()

  res.json({ status: 'done' })
})

module.exports = router
