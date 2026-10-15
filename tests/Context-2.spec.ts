import {test, expect} from '@playwright/test';

test('right click context menu', async ({ page }) => {
    test.setTimeout(60000);

    await page.goto('https://the-internet.herokuapp.com/context_menu');

    const box = page.locator('#hot-spot');
    await box.click({ button: 'right' }); 
    
    page.on('dialog', async dialog => {
        expect(dialog.message()).toBe('You selected a context menu');
        await dialog.dismiss();
    });
})
