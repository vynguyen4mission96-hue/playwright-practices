import {test, expect} from '@playwright/test';

test('js alert', async ({page}) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    await page.getByRole('button', { name: 'Click for JS Alert' }).click();
    
    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toEqual('I am a JS Alert')
        await dialog.accept();
    });

    await expect(page.getByText('You successfully clicked an alert')).toBeVisible();
})

test('js confirm =>cancel', async ({page}) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    
    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toEqual('I am a JS Confirm')
        await dialog.dismiss();
    });

    await expect(page.getByText('You clicked: Cancel')).toBeVisible();
})

test('js confirm =>OK', async ({page}) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    
    //Nếu sau này có dialog xuất hiện, 
    // hãy gọi đoạn code này để xử lý nó.
    //Đăng ký trước (event listener) → kích hoạt sau → callback mới chạy.
    //[đang chờ dialog]
    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toEqual('I am a JS Confirm')
        await dialog.accept();
    });

    await page.getByRole('button', { name: 'Click for JS Confirm' }).click();
    await expect(page.getByText('You clicked: OK')).toBeVisible();
})
test('js prompt ', async ({page}) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    page.on('dialog', async (dialog) => {
        expect(dialog.message()).toEqual('I am a JS prompt')
        // ghi /n để giả lập bấm enter, nếu không có /n thì sẽ không bấm enter
        await dialog.accept('Hello World/n');
    });

    await page.goto("https://the-internet.herokuapp.com/javascript_alerts")
    await page.getByRole('button', { name: 'Click for JS Prompt' }).click();
    await expect(page.getByText('You entered: Hello World')).toBeVisible();
})