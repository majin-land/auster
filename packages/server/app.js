const express = require('express')
require('express-async-errors')
const { createHttpTerminator } = require('http-terminator')
const compression = require('compression')
const noCache = require('nocache')
const requireDir = require('require-dir')
const bodyParser = require('body-parser')
const cors = require('cors')
const helmet = require('helmet')
const frameguard = require('frameguard')
const requestIp = require('request-ip')
const useragent = require('express-useragent')
const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')

const { auth } = require('./middlewares/auth')
const exception = require('./utils/exception')
const { db } = require('./models/db')

const routes = requireDir('./controllers', { recurse: true })

const app = express()

// get PORT from .env file info
const port = process.env.SERVER_PORT || '4010' // default to 4010 if port info not set
const isProduction = process.env.NODE_ENV === 'production'

app.use(cors())
app.use(noCache())
app.use(bodyParser.json({ limit: '10mb' })) // for parsing application/json
app.use(compression())

if (isProduction) {
  // PRODUCTION optimization
  app.disable('x-powered-by')
  app.use(helmet())
  app.use(frameguard())
  app.use(requestIp.mw())
  app.use(useragent.express())
}

app.get('/', (req, res) => {
  res.json({
    meta: {
      code: 200,
      error: null,
      message: `Server is running at: http://localhost:${port}`,
    },
  })
})

// ROUTES -> link to controllers
app.use('/public', routes.public)
app.use('/session', routes.session)
app.use('/category', routes.category)
app.use('/record', auth, routes.record)
app.use('/user', auth, routes.user)

app.use((err, req, res, next) => {
  if (err) {
    const [error, status] = exception(err)

    if (status === 500) {
      res.status(status).json({
        meta: {
          code: 500,
          message: error.message,
        },
      })
    } else {
      res.status(status).json({ meta: error })
    }
    return
  }
  next()
})

app.use((req, res) => {
  if (!res.headersSent) {
    res.status(404).json({ message: 'Sorry can\'t find that!' })
  }
})

const umzug = new Umzug({
  logging: console.log,
  storage: new SequelizeStorage({ sequelize: db }),
  migrations: {
    path: './migrations',
    params: [db.getQueryInterface(), Sequelize],
  },
})

let httpTerminator

umzug
  .up()
  .then(() => {
    const server = app.listen(port, () => {
      console.log(`Server listening http on ${port}`)
      httpTerminator = createHttpTerminator({ server })
      process.send('ready')
    })
  })
  .catch((err) => {
    console.log('ERROR migrating DB:', err)
    process.exit()
  })

process.on('SIGINT', async () => {
  console.log('Received shutdown signal')
  await db.close().catch(() => process.exit(1))
  console.log('DB closed')
  if (httpTerminator) {
    await httpTerminator.terminate().catch(() => process.exit(1))
    console.log('server terminated')
  }
  process.exit(0)
})

module.exports = app
