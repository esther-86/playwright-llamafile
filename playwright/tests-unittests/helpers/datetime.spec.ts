/* eslint-disable jest/no-test-callback */
import { test, expect } from '../../Fixtures/fixture-main';
import My from '../../Flows/My';

const getFutureDatesFromTodayData = [
  {
    today: new Date('2022-01-15T00:00:00Z'),
    expected: 16,
  },
  {
    today: new Date('2022-01-31T00:00:00Z'),
    expected: 0,
  },
  {
    today: 'Invalid-Date',
    expected: 'Invalid Date',
    error: true
  },
  {
    today: new Date('3000-01-32T00:00:00Z'),
    expected: 'Invalid Date',
    error: true
  },
];
for (let current of getFutureDatesFromTodayData) {
  test(`getFutureDatesFromToday, ${JSON.stringify(current)}`, async () => {
    try {

      const futureDates = await My.GeneralHelper.getFutureDatesFromToday();

      if (!current.error) {
        expect(futureDates).toEqual(current.expected);
      } else {
        // If we were expecting an error and none was thrown, fail the test case
        throw new Error(`Expected error '${current.expected}' but no error was thrown`);
      }
    } catch (e) {
      if (current.error) {
        // If we were expecting an error and one was thrown, verify the error message
        expect(e.message).toEqual(current.expected);
      } else {
        throw new Error(`Test case failed: Today is ${current.today}, expected ${current.expected} days, error message: ${e.message}`);
      }
    };
  })
}
