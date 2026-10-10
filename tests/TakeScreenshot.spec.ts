import { test, expect } from '@playwright/test';

// Take a screenshot of the full page
test('full page screenshot', async ({ page }) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('https://the-internet.herokuapp.com');

    await page.screenshot({
        path: 'screenshot.png',
        fullPage: true
    });
});

// Take a screenshot of a specific element
test('element screenshot', async ({ page }) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('https://the-internet.herokuapp.com');

    await page.locator('h1').screenshot({
        path: 'element.png'
    });
});

// Take a screenshot on test failure
test('visual test', async ({ page }) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('https://the-internet.herokuapp.com');

    try {
        //failed thì nó mới take screenshot
        await expect(page.locator('h1')).toHaveText('Expected Text');
    } catch (error) {
        await page.screenshot({
            path: `failure-${test.info().title}.png`
        });

        throw error;
    }
});
