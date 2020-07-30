const router = require('express').Router()

const { Record, Category } = require('../models')

router.get('/', async (req, res) => {
  const result = await Record.findAndCountAll({
    include: [
      {
        model: Category,
      },
    ],
  })

  res.json({
    list: result.rows.map(record => record.display()),
    total: result.count,
  })
})

router.get('/:id', async (req, res) => {
  const where = { id: req.params.id }

  const record = await Record.findOne({ where })
  if (!record) throw new Error('Record not found')

  res.json(record.display())
})

router.post('/', async (req, res) => {
  const { type, categoryId, amount, transactionDate } = req.body

  const record = await Record.create({
    type,
    categoryId,
    amount,
    transactionDate,
  })

  res.json(record.display())
})

router.put('/:id', async (req, res) => {
  const where = { id: req.params.id }

  const record = await Record.findOne({ where })
  record.type = req.body.type
  record.categoryId = req.body.categoryId
  record.amount = req.body.amount
  record.transactionDate = req.body.transactionDate

  await record.save()

  res.json(record.display())
})

router.delete('/:id', async (req, res) => {
  const where = { id: req.params.id }

  const record = await Record.findOne({ where })

  await record.destroy()

  res.json({ status: 'done' })
})

module.exports = router
