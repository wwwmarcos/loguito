#!/usr/bin/env node

const fs = require('fs')
const uuid = require('uuid/v4')

const { USER_CONFIG_FILE_PATH } = require('./config')

fs.writeFileSync(USER_CONFIG_FILE_PATH, JSON.stringify({
  id: uuid()
}))
