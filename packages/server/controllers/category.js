const router = require('express').Router()

const { Category } = require('../models')

router.get('/', async (req, res) => {
  const result = await Category.findAndCountAll()

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
  const category = await Category.create({
    name: req.body.name,
  })

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
