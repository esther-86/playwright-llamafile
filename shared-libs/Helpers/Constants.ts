const { get } = require('lodash')
const path = require('path')

class Constants {

  static GENERATE_RANDOM = 'GENERATE_RANDOM'

  // Timeouts
  static TIMEOUT_SECONDS(seconds) {
    return { timeout: seconds * 1000 }
  }
  static TIMEOUT_MINUTES(minutes) {
    return { timeout: minutes * 60 * 1000 }
  }
}

export { Constants }
