const { test, expect } = require('@playwright/test');

test('home page loads', async ({ page }) => {
  await page.goto(process.env.TARGET_URL || 'https://example.com');
  await expect(page).toHaveTitle(/Example/);
});
