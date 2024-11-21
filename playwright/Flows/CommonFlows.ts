/* eslint-disable jest/valid-expect */
/* eslint-disable jest/no-standalone-expect */
/* eslint-disable no-console */
import My from "./My"; // Not sure why require("./My")['default'] will give undefined but if use import, it works OK
import { expect } from '@playwright/test';

class CommonFlows {
  static async renderContent(context, url: string, content: string) {
    const newPage = await context.newPage()
    await newPage.route(url, route => {
      route.fulfill({ body: content })
    })
    try {
      await newPage.goto(url)
    } catch {

      // TODO: Sometimes, saw that the url is loaded but it would still timeout
      // Instead of ignoring... maybe find a way to fix...
    }
    return newPage
  }
}
export { CommonFlows }
