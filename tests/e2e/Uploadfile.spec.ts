import {test, expect} from '@playwright/test';
import * as fs from 'fs';

test('upload a file', async ({page}) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('https://the-internet.herokuapp.com/upload');
    
    const filePath = 'E:\\Programming practice\\1_playwright-project\\Upload\\TextDoc.txt';
    await page.setInputFiles('input[type="file"]', filePath);

    await page.getByRole('button', { name: 'Upload' }).click();
     //document.querySelector("#drag-drop-upload")
    ////*[@id="drag-drop-upload"]
    //Cho toContainText() chờ lâu hơn
    await expect(page.locator('#uploaded-files')).toContainText('TextDoc.txt', { timeout: 60000 });
    
});


