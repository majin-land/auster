const router = require('express').Router()
const { Op } = require('sequelize')

const { Category } = require('../models')

router.get('/', async (req, res) => {
  const result = await Category.findAndCountAll({
    where: {
      userId: {
        [Op.or]: [null, req.currentUser.id],
      },
    },
    order: [['id', 'ASC']],
  })

  res.json({
    list: result.rows.map(category => category.display()),
    total: result.count,
  })
})

router.get('/:id', async (req, res) => {
  const where = {
    id: req.params.id,
  }

  const category = await Category.findOne({ where })
  if (!category) throw new Error('Category not found')

  res.json(category.display())
})

router.post('/', async (req, res) => {
  const params = {
    name: req.body.name,
    type: req.body.type,
    userId: req.currentUser.id,
  }

  const category = await Category.create(params)

  res.json(category.display())
})

router.put('/:id', async (req, res) => {
  const where = {
    id: req.params.id,
  }

  const category = await Category.findOne({ where })
  category.name = req.body.name

  await category.save()

  res.json(category.display())
})

router.delete('/:id', async (req, res) => {
  const where = { id: req.params.id }

  const category = await Category.findOne({ where })

  await category.destroy()

  res.json({ status: 'done' })
})

module.exports = router
