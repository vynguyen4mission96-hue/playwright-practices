import {test, expect} from '@playwright/test';
//thư viện
//npm install -D fs
import * as fs from 'fs';


test('download a file', async ({page}) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('https://the-internet.herokuapp.com/download');
    const [download] = await Promise.all([
        page.waitForEvent('download'),
        page.getByRole('link', { name: 'Latest.jpeg' }).click(),
    ]);
    
    const suggestedFilename = download.suggestedFilename();
    expect(suggestedFilename).toBe('Latest.jpeg');
    
    const filePath = 'E:/Programming practice/1_playwright-project/download/' + suggestedFilename;
    await download.saveAs(filePath);
    expect(fs.existsSync(filePath)).toBeTruthy();
});

test('download multiple files', async ({page}) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('https://the-internet.herokuapp.com/download');
    const fileNames = ["TextDoc.txt","bb-upload-test.txt"];
    
    //nhớ delete previous files trước khi re-run để nó re-down và lưu lại
   for (const fileName of fileNames) {
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            page.getByRole('link', { name: fileName }).first().click(),
        ]);
        
        const suggestedFilename = download.suggestedFilename();
        expect(suggestedFilename).toBe(fileName);
        
        const filePath = 'E:/Programming practice/1_playwright-project/download/' + suggestedFilename;
        await download.saveAs(filePath);
        expect(fs.existsSync(filePath)).toBeTruthy();
    }
});