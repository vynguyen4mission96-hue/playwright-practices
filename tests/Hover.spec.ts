import {test, expect} from '@playwright/test';

test('dropdown test', async ({ page }) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
  // Go to the dropdown page
  await page.goto('https://the-internet.herokuapp.com/hovers');

  await page.locator('div.figure').nth(0).hover();
  await expect(page.locator('div.figure').nth(0).locator('h5')).toHaveText('name: user1');
});