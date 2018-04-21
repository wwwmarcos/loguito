#!/usr/bin/env node

const { spawn } = require('child_process')
const axios = require('axios')
const minimist = require('minimist')
const uuid = require('uuid')

const { USER_CONFIG_FILE_PATH, API_URL, SITE_URL } = require('./config')
const userConfig = require(USER_CONFIG_FILE_PATH)

const [COMMAND, ...ARGUMENTS] = process.argv.slice(2)

const { loguitoname } = minimist(ARGUMENTS)
const SESSION_ID = loguitoname || uuid()

const sendData = stdout => axios.post(API_URL, {
  data: stdout,
  sessionId: SESSION_ID,
  userId: userConfig.id
})

const verifySessionId = ({ sessionId, userId }) =>
  axios.get(`${API_URL}/check/${sessionId}/${userId}`)

const addDataListener = (stdout, fn) =>
  stdout.on('data', data => fn(data.toString('utf-8')))

const pipeStdio = ({ stdout, stdin, stderr }) => {
  stdout.pipe(process.stdout)
  stdin.pipe(process.stdin)
  stderr.pipe(process.stderr)
}

const start = async () => {
  try {
    await verifySessionId({
      sessionId: SESSION_ID,
      userId: userConfig.id
    })
  } catch (error) {
    console.log(error && error.response ? error.response.data : error)
    process.exit(1)
  }

  console.log(`Access your logs on ${SITE_URL}/${SESSION_ID}`)
  console.log('----')

  const { stdout, stdin, stderr } = spawn(COMMAND, ARGUMENTS)

  addDataListener(stdout, sendData)
  pipeStdio({ stdout, stdin, stderr })
}

start()
