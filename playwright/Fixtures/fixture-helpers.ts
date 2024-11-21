import { chromium } from '@playwright/test';

export const attachToBrowser = async () => {
  const attachedBrowser = await chromium.connectOverCDP('http://localhost:9222');
  const context = attachedBrowser.contexts()[0];

  // Only expect one main working tab when starting out... 
  // Need to wait for ENTER on navigation anyways
  const page = context.pages()[0];
  return { context, page }
}