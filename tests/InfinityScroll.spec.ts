import {test, expect} from '@playwright/test';

test('change infinity scroll down', async ({ page }) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);

    await page.goto('https://the-internet.herokuapp.com/infinite_scroll');

    //kéo xuống tới 100
    for (let i=0; i<5; i++){
        await page.mouse.wheel(0,100);
        
    }

})