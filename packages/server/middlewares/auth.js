const {
  Session,
  User,
} = require('../models')

module.exports.auth = async (req, res, next) => {
  try {
    const token = req.get('Authorization')
    if (
      typeof token === 'undefined' ||
      token === null
    ) throw new Error('000401')

    const session = await Session.findOne({ where: { token } })
    if (!session) throw new Error('000401')

    const user = await User.findOne({ where: { userId: session.userId } })
    if (!user || !user.id) throw new Error('000401')

    req.currentUser = user.display()
    next()
  } catch (e) {
    next(e)
  }
}
