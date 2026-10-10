import {test, expect} from '@playwright/test';


//skip: Không chạy test này
// Ví dụ test đang:
// chưa hoàn thành
// đang bị lỗi và tạm thời chưa muốn chạy
// phụ thuộc vào một feature chưa available
// muốn tạm thời loại test khỏi test suite
test.skip('Entry ad popup', 
    {tag: '@smoke'},
    async ({ page }) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    // Chỉnh trong playwright.config.ts cũng được
    test.setTimeout(60000);

    // baseURL: 'https://the-internet.herokuapp.com' - trong playwright.config.ts
    // Có thể viết ngắn ở dưới thành:
    // await page.goto('/entry_ad');
    await page.goto('https://the-internet.herokuapp.com/entry_ad');

     // Assert popup xuất hiện
    await expect(
        page.getByRole('heading', { name: 'THIS IS A MODAL WINDOW' })
    ).toBeVisible();

    // Setup the handler
     // Setup handler để tự động đóng popup khi popup xuất hiện
    await page.addLocatorHandler(
        page.getByRole('heading', { name: 'THIS IS A MODAL WINDOW' }),
        async () => {
            await page.locator('.modal .modal-footer p').click();
        }
    );

    await expect(
        page.getByRole('heading', { name: 'Entry Ad' })
    ).toBeVisible();

    // await page.getByRole('link', { name: 'click here' }).click();
});