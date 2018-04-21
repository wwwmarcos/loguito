const app = require('fastify')({ logger: true })
const log = require('./model')
const { buildMessageSessionIdErrorMessage } = require('./utils')

app.post('/', async (req, res) => {
  const { data, sessionId, userId } = req.body

  if (log.isSessionIdInUse({ sessionId, userId })) {
    return res.code(400).send({
      message: buildMessageSessionIdErrorMessage(sessionId)
    })
  }

  log.save({
    data,
    sessionId,
    userId
  })

  return {
    message: 'ok'
  }
})

app.get('/:sessionId', async ({ params: { sessionId } }) => ({
  message: 'ok',
  data: log.findBySessionId(sessionId)
}))

app.get('/check/:sessionId/:userId', async (req, res) => {
  const { sessionId, userId } = req.params

  if (log.isSessionIdInUse({ sessionId, userId })) {
    return res.code(400).send(buildMessageSessionIdErrorMessage(sessionId))
  }

  return res.send()
})

app.listen(process.env.PORT || 3000, '0.0.0.0', (err) => {
  if (err) throw err
  console.log(`server listening on ${app.server.address().port}`)
})
