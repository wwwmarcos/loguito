#!/usr/bin/env node

const { spawn } = require('child_process')
const axios = require('axios')
const minimist = require('minimist')
const uuid = require('uuid')

const { USER_CONFIG_FILE_PATH, API_URL } = require('./config')
const userConfig = require(USER_CONFIG_FILE_PATH)

const [COMMAND, ...ARGUMENTS] = process.argv.slice(2)

const { loguitoname } = minimist(ARGUMENTS)
const SESSION_ID = loguitoname || uuid()

const sendData = stdout => axios.post(API_URL, {
  data: stdout.toString('utf-8'),
  sessionId: SESSION_ID,
  userId: userConfig.id
})

const verifySessionId = ({ sessionId, userId }) =>
  axios.get(`${API_URL}/check/${sessionId}/${userId}`)

const addDataListener = (stdout, fn) =>
  stdout.on('data', data => fn(data.toString('utf-8')))

const command = spawn(COMMAND, ARGUMENTS)

const start = async () => {
  try {
    await verifySessionId({
      sessionId: SESSION_ID,
      userId: userConfig.id
    })
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      return console.log('No internet connection')
    }

    console.log(error.response.data)
    process.exit(1)
  }

  console.log(`Access your logs on https://loguito.js.org/${SESSION_ID}`)
  console.log('----')
  addDataListener(command.stdout, sendData)

  command.stdout.pipe(process.stdout)
  command.stdin.pipe(process.stdin)
  command.stderr.pipe(process.stderr)
}

start()
