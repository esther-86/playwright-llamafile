/* eslint-disable jest/no-test-callback */
import { expect, test } from '../../Fixtures/fixture-main';
import My from '../../Flows/My';
import * as path from 'path';

// 11/22/24: https://docs.google.com/spreadsheets/d/1E2PvvPxxt5aDzHgI-BLovysGF-eGbz9jiOvj_18dkAc/edit?gid=0#gid=0
// 11/22/24: https://news.ycombinator.com/item?id=39709699
const poc_data = [
  { ticket: 'TA-2984,@poc', tcs: 'JIRA-T1' }
];
for (const current of poc_data) {
  test(`This is a POC to use llamafile with Playwright and have a framework for it. ${JSON.stringify(current)}`,
    async ({ thisTest, context, page }) => {
      await thisTest.initializeTestInfo(test, current, page, context)
      // Launch https://www.techlistic.com/p/selenium-practice-form.html
      const filePath = path.resolve(__dirname, 'selenium-practice-form.html');
      await page.goto(`file://${filePath}`, { waitUntil: 'commit' });
      const html = await page.content()
      let value = await My.Api.LM.runQuery(
        `What is the Playwright code to fill out available on the page with this HTML?\r\n` +
        `${html}`)
      console.log(value)
      value = await My.Api.LM.runQuery(
        `What is Xpath to "First Name" field for the following HTML?\r\n` +
        `${html}`)
      console.log(value)
    });
}

