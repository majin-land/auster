const router = require('express').Router()

const { User } = require('../models')

router.get('/', async (req, res) => {
  const result = await User.findAndCountAll()

  res.json({
    list: result.rows.map(user => user.display()),
    total: result.count,
  })
})

router.get('/:id', async (req, res) => {
  const where = { id: req.params.id }

  const user = await User.findOne({
    where,
  })

  if (!user) throw new Error('User not found')

  res.json(user.display())
})

router.post('/', async (req, res) => {
  const { name, email, password } = req.body

  if (!name) throw new Error('Name is required')
  if (!email) throw new Error('Email is required')
  if (!password) throw new Error('Password is required')

  const existingUser = await User.findOne({ where: { email } })
  if (existingUser) throw new Error('User email is already used')

  const user = await User.create({
    name,
    email,
    password,
  })

  res.json(user.display())
})

module.exports = router
