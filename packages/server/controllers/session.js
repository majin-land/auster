const router = require('express').Router()

const { User, Session } = require('../models')

router.get('/', async (req, res) => {
  const token = req.get('Authorization')
  if (
    typeof token === 'undefined' ||
    !token
  ) throw new Error('Unauthorized access')

  const session = await Session.findOne({ where: { token } })
  if (!session) throw new Error('Unauthorized access')

  const user = await User.findOne({ where: { id: session.userId } })
  if (!user) throw new Error('User not found')

  res.json(user.display())
})

router.post('/', async (req, res) => {
  const { email, password } = req.body

  const user = await User.validatePassword(email, password)
  if (!user) throw new Error('Invalid email or password')

  const accessToken = await Session.generateAccess(user.id)

  res.json({ accessToken })
})

router.post('/register', async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
    } = req.body

    if (!name) throw new Error('Name is required')
    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')

    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) throw new Error('User email is already used')

    // create user
    const user = await User.create({
      name,
      email,
      password,
    })

    const accessToken = await Session.generateAccess(user.id)

    res.json({ accessToken })
  } catch (e) {
    console.error('ERROR in registering new user', e)
    next(e)
  }
})

router.delete('/', async (req, res) => {
  const token = req.get('Authorization')
  if (
    typeof token === 'undefined' ||
    !token
  ) throw new Error('000401')

  await Session.destroy({ where: { token } })

  res.json({ status: 'done' })
})

module.exports = router
