/* eslint-disable jest/no-test-callback */
import { expect, test } from '../../Fixtures/fixture-main';
import My from '../../Flows/My';

const poc_data = [
  { ticket: 'TA-2984,@poc', tcs: 'JIRA-T1' }
];
for (const current of poc_data) {
  test(`This is a POC to use llamafile with Playwright and have a framework for it. ${JSON.stringify(current)}`,
    async ({ thisTest, context, page }) => {
      await thisTest.initializeTestInfo(test, current, page, context)
      // Launch https://www.techlistic.com/p/selenium-practice-form.html
      const value = await My.Api.LM.runQuery('Write a sentence here')
      console.log(value)
    });
}
