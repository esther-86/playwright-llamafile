/* eslint-disable no-console */
import { GmailHelper } from "shared-libs/gmail/GmailHelper";
import My from "./../Flows/My"; // Not sure why require("./My")['default'] will give undefined but if use import, it works OK

class EmailHelper {

  static async getEmailsSince(context, matchEmailContent, options?) {

    // Saw that the email getting might get an old email.
    // To remedy this, need to pass in the email content to match and not just return any email 
    // based on the email retrieval time. If still can't get the email, try again...
    for (let i = 0; i < 3; i++) {
      console.debug(`DEBUG: Checking email for ${matchEmailContent} iteration ${i}`)
      let results
      try {
        results = await EmailHelper.getEmailsSinceOptions(context, matchEmailContent, options)
      }
      catch (err) {
        if (i == 2) {
          throw err
        }
        continue
      }

      if (results.emails.length != 0) {
        return results
      }

      // 9/19/24: Thought of using this again but saw that it was commented in the past so decided
      // against using it because the after time should be determined at the test level and not moved 
      // else, we might never find the email we want to find
      // options.after.setSeconds(options.after.getSeconds() + 15)
    }
    return {} // To have error when tried to access something without returned emails
  }

  // https://www.npmjs.com/package/gmail-tester
  // options.to
  // option.after: Not sure if this is in UTC time or how should it
  static async getEmailsSinceOptions(context, matchEmailContent, options?) {
    const tcs = My.TestInfo.data.tcs
    if (!options) { options = {} }
    if (!options.to) { throw new Error('option.to should be specified') }

    // These options get used in the Gmail retrieval library, that's why it was sent into checkInbox
    if (!options.after) { throw new Error('option.after should be specified (use getFindEmailOptions)') }
    options.matchEmailContent = matchEmailContent

    const emailsMatchingDt = await GmailHelper.checkInbox(options)
    const emails = []
    const emailContentByLine = []
    const emailsContentByLine = []
    const emailLinks = []
    for (const email of emailsMatchingDt) {
      const emailBody = email.body
      const emailLines = emailBody.text.split('\r\n').filter(line => line.trim() !== '')

      emails.push(email)

      const newPage = await My.CommonFlows.renderContent(context, My.Constants.URL_EMAIL, emailBody.html)

      emailContentByLine.push(emailLines)
      emailsContentByLine.push(...emailLines)
      await newPage.close()
    }

    return { emails, emailContentByLine, emailsContentByLine, emailLinks }
  }
}

export { EmailHelper }
