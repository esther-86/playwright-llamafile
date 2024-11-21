import { test as setup } from '@playwright/test';
const My = require("./../Flows/My")['default'] // instead of import to see My.Env not undefined, else have to use like My.default.Env

// https://playwright.dev/docs/test-global-setup-teardown
setup('setup api', async ({ playwright }) => {
});