/* eslint-disable no-empty-pattern */
/* eslint-disable lines-around-comment */
import { test as base } from '@playwright/test';
import { attachToBrowser } from "./fixture-helpers";
import My from "../Flows/My";
// const My = require("./../Flows/My")['default'] // instead of import to see My.Env not undefined, else have to use like My.default.Env

// Save data generated from the test to here so that we can choose which data to use when the time comes
class ThisTest {

  // adminClient
  // locales_en
  // participantEmail
  // current
  // participantPu (queried and saved when loadLocaleForParticipant)
  // locales
  playwright: any;
  data: any = {};
  cleanupFunctions = [];
  toDelete: any = {
    userIds: [],
    participantIds: [],
    schedules: [],
    templates: []
  };
  translatedDict: any = {};

  getFindEmailOptions(userInfo?): any {
    if (!userInfo) {
      userInfo = this.data.participantInfo
    }
    const findEmailOptions = {
      to: userInfo.email,
      after: this.data.emailDT
    }
    return findEmailOptions
  }

  updateEmailDT(options?) {
    if (!options) { options = {} }
    // Subtract some time so that the timeframe is not too tight for actions that are super quick 
    // so that hopefully we don't have failures due to email not found anymore
    // Tried subtracting 60 seconds - tests started failing
    if (options.subtractSecs === undefined) { options.subtractSecs = 15 }
    const dt = new Date()
    dt.setSeconds(dt.getSeconds() - options.subtractSecs)
    this.data.emailDT = dt
  }

  // Priority: Get from environment variable (My.Env). Can be overwritten with test-level parameter (current)
  // Always set calculated value to this.data...
  async initializeTestInfo(test, current, page, context, options?) {
    await this.skipTestsBasedOnTestInfo(test, current)
    if (!options) { options = {} }
    // 8/6/24: Per conversation with Akshay. Team in India consistently saw that the tests take longer than 5 minutes to run
    // Instead of litter the 10 minutes everywhere, setting it here. If test should timeout earlier, set it in the test
    test.setTimeout(My.Constants.TIMEOUT_MINUTES(10).timeout)

    if (!this.data.startDT) { this.data.startDT = new Date() }
    console.debug(`DEBUG: startDT ${this.data.startDT}`)
    if (!this.data.emailDT) { this.data.emailDT = new Date() }

    // Load current into data
    for (const key in current) {
      this.data[key] = current[key];
    }

    if (My.IsFirstTestRun) {
      // Setup functions once for all tests in this test run
      My.IsFirstTestRun = false
    }

    let promises = []
    // Setup functions per test
    await Promise.all(promises)
    promises = []

    return page
  }

  async skipTestsBasedOnTestInfo(test, current) {
    if (current.ticket.includes('@deprecated')) {
      test.skip(`Test skipped as was deprecated`)
      return
    }
    if (current.ticket.includes('@skip')) {
      test.skip(`Test skipped as stated`)
      return
    }
    if (current.tcVersion && !current.tcVersion.includes('@runTcVersion')) {
      test.skip(`Test skipped because not the version that should be ran`)
      return
    }
    if (current.ticket.includes('@bug') || current.ticket.includes('@issue')) {
      const includeBugs = My.Env.TEST_INCLUDE_BUGS ? My.Env.TEST_INCLUDE_BUGS.toLowerCase() : 'false'
      if (includeBugs !== 'true') {
        test.skip(`Skipping due to test having a known bug`)
        return
      }
    }
  }
}

// Declare the types of your fixtures.
type MyFixtures = {
  thisTest: ThisTest
  adminClient: any
  persistentPage: any
  persistentContext: any
};

// https://playwright.dev/docs/test-fixtures
// This new "test" can be used in multiple test files, and each of them will get the fixtures.
export const test = base.extend<MyFixtures>({

  // Fixture so that if we want to do clean up, we can... and we should...
  thisTest: async ({ playwright }, use) => {
    // Setup
    const thisTest = new ThisTest();
    thisTest.playwright = playwright
    My.TestInfo = thisTest

    // Allow test to use thisTest as an argument
    await use(thisTest);

    let cleanupPromises = []
    // Trigger the cleanup function
    for (const fxn of thisTest.cleanupFunctions) {
      cleanupPromises.push((async () => {
        try { await fxn() }
        catch (ex) { console.log(`TEARDOWN cleanupFunction ${fxn}: ${ex.message}`) }
      })())
    }
    await Promise.all(cleanupPromises)
    cleanupPromises = []
  },

  // To use during scripting so that we use a persistent browser and not have to wait for test to run from start
  // This will also avoid a bunch of unnecessary test data generation
  persistentPage: async ({ }, use) => {
    const currentBrowser = await attachToBrowser()
    const persistentPage = currentBrowser.page
    await use(persistentPage)
  },

  persistentContext: async ({ }, use) => {
    const currentBrowser = await attachToBrowser()
    const persistentContext = currentBrowser.context
    await use(persistentContext)
  },

});

export { expect } from '@playwright/test';
export { ThisTest };
