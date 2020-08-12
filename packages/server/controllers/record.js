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
      }
    },
    include: [
      {
        model: Category,
        as: 'category',
        required: false,
      },
    ]
  })

  const income = result
    .filter(record => record.type === 'income')
    .reduce((total, record) => {
      return total + Number(record.amount)
    }, 0)

  const expense = result
    .filter(record => record.type === 'expense')
    .reduce((total, record) => {
      return total + Number(record.amount)
    }, 0)

  const data = result.reduce((acc, curr) => {
    const key = moment(curr['transactionDate']).format('YYYY-MM-DD')

    if (!acc[key]) {
      acc[key] = []
    }

    acc[key].push(curr)

    return acc
  }, {})

  res.json({
    data,
    income,
    expense
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
  const { type, category, amount, transactionDate, note } = req.body

  const record = await Record.create({
    userId: req.currentUser.id,
    categoryId: category,
    type,
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

  const record = await Record.findOne({ where })
  record.type = req.body.type
  record.categoryId = req.body.category
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
