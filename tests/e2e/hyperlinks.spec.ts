//tự viết- import để nó đừng bị error
import {test, expect} from '@playwright/test';

test('1.verify hyperlink', async({page})=>{
// Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('https://the-internet.herokuapp.com/status_codes')
    await page.getByRole('link',{name: '200'}).click()
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/status_codes/200')

    await page.getByRole('link', {name: 'here'}).click()
     await expect(page).toHaveURL(
    'https://the-internet.herokuapp.com/status_codes');

    await page.getByRole('link',{name: '301'}).click()
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/status_codes/301')

    //hàm goBack()
    await page.goBack()
      await expect(page).toHaveURL(
    'https://the-internet.herokuapp.com/status_codes');

    await page.getByRole('link',{name: '404'}).click()
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/status_codes/404')

    await page.getByRole('link', {name: 'here'}).click()
      await expect(page).toHaveURL(
    'https://the-internet.herokuapp.com/status_codes');

    await page.getByRole('link',{name: '500'}).click()
    await expect(page).toHaveURL('https://the-internet.herokuapp.com/status_codes/500')

    await page.getByRole('link', {name: 'here'}).click()
      await expect(page).toHaveURL(
    'https://the-internet.herokuapp.com/status_codes');

    })