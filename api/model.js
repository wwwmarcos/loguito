const db = require('./db')

const save = (data) =>
  db.push(data)

const isSessionIdInUse = ({ sessionId, userId }) =>
  db.find(data => data.sessionId === sessionId && data.userId !== userId)

const findBySessionId = sessionId =>
  db.filter(data => data.sessionId === sessionId)

module.exports = {
  save,
  isSessionIdInUse,
  findBySessionId
}
