const { chromium } = require('playwright');

// cd playwright
// node tests-playwright/DEBUGGER-START.js

// Trying to connect to existing playwright session via Chromium CDP
// https://github.com/microsoft/playwright/issues/11442
async function launchPersistentContext() {
  const persistentContext = await chromium.launchPersistentContext('', {
    // https://stackoverflow.com/questions/74341199/playwright-javascript-maximize-browser
    // https://github.com/microsoft/playwright/issues/1086
    // '--start-maximized', '--start-fullscreen' '--window-size=1280,720'
    args: ['--remote-debugging-port=9222', '--window-size=1400,920'],
    devTools: true,
    headless: false,
    userAgent: 'Persistent content for debugging',
    viewport: null
  });
}

launchPersistentContext().catch(error => {
  console.error('Error launching persistent browser:', error);
});

// **************************************************************************************************************
// FILE NAMING CONVENTION
// [functionality]/[affected_apps]-[summary].spec.ts
//
// KEYWORDS FOR SEARCHABILITY and UNIFORMITY
// // uniquefy
// Bug? to note in comment regarding potential bugs affecting automation, for searchability. 
// Also, add to https://docs.google.com/document/d/1FlQD4fCDGughAoeWArFLmTWe98p6wKUZRBKeYhur0lU/edit
// verify... (don't use check...)
// get...Locator
// select... (don't use check...)
// console.debug(`DEBUG: TODO: REMOVE WORKAROUND
// @noPiiBug,@piiBug,@bug
// 
// BEST PRACTICES:
// - On test-level (top-level) test code - don't have locator-specific items. Everything should be readable in English
// - Base test data on study information when possible (make test resilient to study config). For example, instead of specifying Site 2... Use a function that find another site not site x 
// - Only do UI when needed as part of test, else, use API
// - Put sharable/reusable code under API/Flows. thisTest is for test-data related... Think about reusability
// - Potential bug should have Bug? in comment for searchability
// - Have ESLint/prettier on so when save, code gets formatted
// - DON'T use hardcoded indexing and think about reusability and changes whenever possible
// - DON'T PASS IN thisTest, current to non-test level code - pass in expected value only (Remove thisTest parameter - it should pass in what it needs, not pass in thisTest)
// - Write test from the outside in (test level first, then refactor and generate test methods)
// - After initializeTestInfo, use thisTest.data instead of current
// - Use options to specify flow behavior. For example, add OE/submit clicking, etc.
// - tcs instead of thisTest in OE, PDF, and Email helpers because those functions only care about the tcs and shouldn't need to know about thisTest
// - Don't have create, actions, etc. in the flow... fillFormToCreateNewParticipant + create instead of createNewParticipant...
// - Have the OE + assertions + toDeletes be done at the top test level... but that means that the verification for the pop ups will need to be duplicated
// - When need to use text, try to find an image instead for localization purpose
// - Try to minimize parameters for test until it's needed
// - Don't use Env.ORG_NAME in code... pass in the orgName and use from thisTest.data.orgName most of the time to have same base for PII/NoPII org
// - If test is not about user/participant creation, don't do it via the UI (preconditions via API)
// - Check for code exists before adding
// - assertions/expects function starts with "verify" for easy find/replace
// - Retries at test level: https://github.com/microsoft/playwright/issues/10825
/*
test.describe(() => {
  test.describe.configure({ retries: 2 });

})
*/
// Playwright 1.45+: Set date for browser: https://stackoverflow.com/questions/63960549/can-i-set-the-date-for-playwright-browser

// **************************************************************************************************************

// Randomly can't see the play button for the test anymore: https://github.com/microsoft/playwright/issues/23356#issuecomment-1869112159

// npx playwright codegen --viewport-size=1400,920
// https://github.com/microsoft/playwright/issues/9015: Generate with data-testid, etc. as much as possible

// npx playwright test --ui (might need to comment 'setup api' from playwright.config.ts. Remember to uncomment)
// npx playwright test -g "Attach to persistent browser and run code" --headed

// npx playwright show-report '/Users/huonglai/Downloads/artifacts/playwright/test-html'
// npx playwright show-trace test-results/trace.zip 

// Playwright/CodeceptJS doesn't show up in Recorder's export options: https://bugs.chromium.org/p/chromium/issues/detail?id=1351416
// >>  (switch to a different tab in Devtools, close your browser, and reopen then switch back to the Recorder section)
// Codegen not working: https://github.com/microsoft/playwright/issues/16154
// npx playwright codegen --channel chrome https://google.com
// Attaching playwright to existing browser window:
// https://github.com/microsoft/playwright/issues/1985
// https://www.jvt.me/posts/2023/09/30/playwright-use-existing-session/
// https://www.google.com/search?q=how+does+Katalon+or+Mabl+run+using+existing+browser+work%3F&rlz=1C5GCEM_enUS1084US1084&oq=how+does+Katalon+or+Mabl+run+using+existing+browser+work%3F&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRigAdIBCTM1MjYzajBqNKgCALACAA&sourceid=chrome&ie=UTF-8
// When you execute a test case in katalon, it start a driver instance of browser (not actual browser with all plugins & settings) . It is expected to work this way… Now if you want to use same active browser then this can be done only with chrome driver in katalon.
// Debugging: https://youtu.be/rhzrFiKfWwY?t=76
// https://developer.chrome.com/docs/devtools/recorder/reference