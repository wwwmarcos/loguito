const os = require('os')
const path = require('path')

const CONFIG_FILE_NAME = '.loguito.json'
const HOME = os.homedir()

module.exports = {
  USER_CONFIG_FILE_PATH: path.join(HOME, CONFIG_FILE_NAME),
  API_URL: 'http://localhost:3000'
}
