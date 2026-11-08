import {test, expect} from '@playwright/test';

test('right click context menu', async ({ page }) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    
    // Go to the context menu page
    await page.goto('https://the-internet.herokuapp.com/context_menu');
    
    // Right click on the box
    //<div id="hot-spot" style="border-style: dashed; border-width: 5px; width: 250px; height: 150px;" oncontextmenu="displayMessage()">
    //</div>
    const box = page.locator('#hot-spot');
    await box.click({ button: 'right' }); 
    
    // Wait for the alert to appear
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('You selected a context menu');
        //dismiss là bấm cancel, accept là bấm ok
        await dialog.dismiss();
    });
})
