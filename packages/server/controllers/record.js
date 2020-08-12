const router = require('express').Router()
const moment = require('moment')
const { Op } = require('sequelize')
const { Record, Category } = require('../models')

router.get('/:startDate/:endDate', async (req, res) => {
  const startDate = moment(req.params.startDate).startOf('month')
  const endDate = moment(req.params.endDate).endOf('month')

  const result = await Record.findAndCountAll({
    where: {
      // userId: req.currentUser.id,
      transactionDate: {
        [Op.lt]: endDate,
        [Op.gt]: startDate,
      }
    },
    // include: [
    //   {
    //     model: Category,
    //     as: 'category',
    //     required: false,
    //   },
    // ]
  })

  res.json(result)
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
    userId: '365d4836-1584-4d0e-8aab-573642666ac1',
    // userId: req.currentUser.id,
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
    // userId: req.currentUser.id,
    userId: '365d4836-1584-4d0e-8aab-573642666ac1',
  }

  const record = await Record.findOne({ where })
  record.type = req.body.type
  record.categoryId = req.body.categoryId
  record.amount = req.body.amount
  record.transactionDate = req.body.transactionDate
  record.note = req.body.note

  await record.save()

  res.json(record.display())
})

router.delete('/:id', async (req, res) => {
  const where = {
    id: req.params.id,
    // userId: req.currentUser.id,
    userId: '365d4836-1584-4d0e-8aab-573642666ac1',
  }

  const record = await Record.findOne({ where })

  await record.destroy()

  res.json({ status: 'done' })
})

module.exports = router
