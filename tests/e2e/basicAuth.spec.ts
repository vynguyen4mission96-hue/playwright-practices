import {test, expect} from '@playwright/test';

test('login successfully with valid credential', async ({ page }) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    //nhập user/pwd
    //tính năng của HTML
    //kiểu cũ
    await page.goto('https://admin:admin@the-internet.herokuapp.com/basic_auth');
    await expect(page.getByRole('heading', {name: 'Basic Auth'})).toBeVisible()

})