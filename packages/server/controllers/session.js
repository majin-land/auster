const router = require('express').Router()

const { User, Session } = require('../models')

router.get('/', async (req, res) => {
  const auth = req.get('Authorization')
  if (
    typeof auth === 'undefined' ||
    !auth
  ) throw new Error('Unauthorized access')

  const session = await Session.findOne({ where: { token: auth } })
  if (!session) throw new Error('Unauthorized access')

  const user = await User.findByPk(session.userId)

  if (!user) throw new Error('Invalid email or password')

  res.json(user.display())
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  const user = await User.validatePassword(email, password)

  if (!user) throw new Error('Invalid email or password')

  const accessToken = await Session.generateAccess(user.id)

  return res.json({ accessToken, user: user.display() })
})

router.post('/register', async (req, res, next) => {
  let transaction = null
  try {
    const {
      name,
      email,
      password,
    } = req.body

    if (!name) throw new Error('Name is required')
    if (!email) throw new Error('Email is required')
    if (!password) throw new Error('Password is required')

    transaction = await sequelize.transaction()

    const existingUser = await User.findOne({ where: { email }, transaction })
    if (existingUser) throw new Error('User email is already used')

    // create user
    const user = await User.create({
      name,
      email,
      password,
    }, { transaction })

    await transaction.commit()

    res.json(user.display())

  } catch (e) {
    console.error('ERROR in registering new entity', e)
    if (transaction) await transaction.rollback()
    next(e)
  }
})

module.exports = router
