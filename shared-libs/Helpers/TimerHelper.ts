/* eslint-disable no-console */
class TimerHelper {

  static async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // polling function should return a boolean
  static async pollUntil(pollingFunc, options = undefined) {

    // Setting defaults
    if (!options) { options = {} }

    // Default tries should be something small to avoid long test run time. If a test needs higher tries - use secondsToWait or increase tries in the test and mark with @longMins_ or @longHrs_
    if (!options.tryCount) { options.tryCount = 60 }
    if (!options.customTimeoutMsg) { options.customTimeoutMsg = undefined }
    if (!options.sleepMs) { options.sleepMs = 500 }
    if (!options.silentFail) { options.silentFail = false }
    if (!options.failOnFirstException) { options.failOnFirstException = false }

    // JS start timer, if loop is longer than x seconds (if defined), break from loop
    let loopDurationMs
    if (options.secondsToWait > 0) {
      loopDurationMs = options.secondsToWait * 1000
      options.tryCount = Number.NEGATIVE_INFINITY
    }

    const loopStartTime = (new Date()).getTime()

    let continueLoop = true
    let tryCount = options.tryCount
    let exception
    for (let iterationCount = 0; continueLoop; iterationCount++) {
      try {
        const res = await pollingFunc(iterationCount)
        if (res) { continueLoop = false; break }
      } catch (err) {
        if (`${exception}`.includes('browser has been closed')) { throw err }
        if (options.throwIfMatchErrMsg && `${exception}`.includes(options.throwIfMatchErrMsg)) { throw err }
        exception = err
        console.log(`DEBUG: pollUntil exceptions ${exception}`)
      }

      await TimerHelper.sleep(options.sleepMs)

      if (tryCount-- > 0) {
        continueLoop = true
      } else if (options.tryCount === Number.NEGATIVE_INFINITY) {
        continueLoop = true
      } else if (options.failOnFirstException && exception !== undefined) {
        console.log('Loop instructed to be stopped on first exception. Breaking from the loop.')
        break
      } else {
        console.log(`Loop exceeded ${options.tryCount} tries. Breaking from the loop.
        ${options.customTimeoutMsg ? options.customTimeoutMsg : pollingFunc}`)
        break
      }

      if (options.secondsToWait && ((new Date()).getTime() - loopStartTime) > loopDurationMs) {
        console.log(`Loop exceeded ${options.secondsToWait} seconds. Breaking from the loop.
        ${options.customTimeoutMsg ? options.customTimeoutMsg : pollingFunc}`)
        break
      }
    }

    if (continueLoop && !options.silentFail) {
      throw new Error(`Polling function did not have expected results.
    ${options.customTimeoutMsg ? options.customTimeoutMsg : ''}
    ${exception ? 'Exception: ' + exception : ''}`)
    }
  }

}

export { TimerHelper }