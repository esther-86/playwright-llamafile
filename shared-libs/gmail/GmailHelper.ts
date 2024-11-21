import { TimerHelper } from "../Helpers/TimerHelper";
import { GeneralHelper } from "../Helpers/GeneralHelper";
const path = require("path");
const gmail = require("gmail-tester");

/* eslint-disable no-console */
/*
https://qatestautomation.com/2022/12/13/configuring-google-email-account-for-cypress-playwright-tests/
https://github.com/levz0r/gmail-tester/blob/master/README.md#how-to-get-credentialsjson
https://medium.com/@maksymbarvinskyi/testing-html-emails-with-playwright-bc81c2f5ec05

https://stackoverflow.com/questions/66058279/token-has-been-expired-or-revoked-google-oauth2-refresh-token-gets-expired-i

Google cloud console
Gmail API For Testing
gmail-api-for-testing-1
*/
class GmailHelper {

  static async checkInbox(options?) {
    if (!options) { options = {} }
    // Which inbox to poll. credentials.json should contain the credentials to it.
    // options.to: required
    if (!options.wait_time_sec) { options.wait_time_sec = 10 } // Poll interval (in seconds).
    // 6/21/24: Increase due to emails arriving late using edge env
    // Maximum poll time (in seconds), after which we'll give up
    if (!options.max_wait_time_sec) { options.max_wait_time_sec = options.wait_time_sec * 12 }
    if (!options.include_body) { options.include_body = true }
    if (!options.ms_wait_before_checking) { options.ms_wait_before_checking = 10 * 1000 } // So that there is enough time for the email to be delivered

    let retEmails = []
    // PJT-T21: Move the match content into the checkInbox and use the max time and not just return when an email is found
    // Previously, max_wait_time_sec was just to wait max time until a email is found
    // We want to reuse it for max_wait_time until the desired email with content is found
    await TimerHelper.pollUntil(async () => {
      await TimerHelper.sleep(options.ms_wait_before_checking)

      console.log(`DEBUG: Start Gmail checking [${new Date()}] ${JSON.stringify(options)}`)
      const prefix = (options.to.split('+')[0]).toLowerCase()
      const emails = await gmail.check_inbox(
        path.resolve(__dirname, `${prefix}/gmail-credentials.json`), // Assuming credentials.json is in the current directory.
        path.resolve(__dirname, `${prefix}/gmail-token.json`), // Look for gmail_token.json in the current directory (if it doesn't exists, it will be created by the script).
        options
      );
      console.log(`DEBUG: End Gmail checking [${new Date()}] ${JSON.stringify(options)}`)

      if (!emails) { return [] } // Return empty array so that it can be retried, if desired.

      retEmails = []
      for (const email of emails) {
        GeneralHelper.logObject(email)

        const emailBody = email.body
        const emailLines = emailBody.text.split('\r\n').filter(line => line.trim() !== '')
        // If doesn't contain what we want, don't include it
        if (options.matchEmailContent &&
          !emailLines.some(line => `${line}`.includes(options.matchEmailContent)) &&
          !emailBody.html.includes(options.matchEmailContent)
        ) {
          continue
        }

        retEmails.push(email)
      }

      return retEmails.length > 0
    }, { secondsToWait: options.max_wait_time_sec })

    // Saw in debugging that emails in the 0th position is the latest email received
    return retEmails;
  }

}

export { GmailHelper }