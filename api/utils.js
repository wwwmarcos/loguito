const buildMessageSessionIdErrorMessage = sessionId =>
  `The sessionId "${sessionId}" is already in use`

module.exports = {
  buildMessageSessionIdErrorMessage
}
