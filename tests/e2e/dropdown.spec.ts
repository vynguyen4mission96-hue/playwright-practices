//tự viết- import để nó đừng bị error
import {test, expect} from '@playwright/test';

//cách 1
test('1.verify selection in dropdown', async({page})=>{
     // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('https://the-internet.herokuapp.com/dropdown')

     //nhớ: step+ verify (expected results)
    await page.locator('#dropdown').selectOption('1')
    await expect (page.locator('#dropdown')).toHaveValue('1')
})

//cách 2
test('2.verify selection in dropdown', async({page})=>{
     // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await page.goto('https://the-internet.herokuapp.com/dropdown')

     //nhớ: step+ verify (expected results)
    await page.getByRole('combobox').selectOption({label: 'Option 1'})
    await expect (page.getByRole('combobox')).toHaveValue('1')

    //bỏ chọn thì để value rỗng
    //unselect all options
    await page.getByRole('combobox').selectOption([])
    await expect (page.getByRole('combobox')).toHaveValue('')
})

//multiple selections
test('3.selecting multiple selections', async({page})=>{
     // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    //test.setTimeout(60000);
    await page.goto('https://qa-demo-site-ten.vercel.app/elements/dropdown')
    await page.getByTestId('dropdown-multiple')
    .selectOption(['java', 'go', 'rust'])
    //values co "s" vì số nhiều
    //['java', 'go', 'rust'] viết thường vì lấy theo value trong HTML
    await expect(page.getByTestId('dropdown-multiple')).toHaveValues(['java', 'go', 'rust'])

    })

    //multiple checkboxes
test('4.selecting multiple checkboxes', async({page})=>{
    await page.goto('https://qa-demo-site-ten.vercel.app/elements/checkboxes')
    //box thứ 1 là Native Box
    await page.getByRole('checkbox', {name: 'Native Checkbox'}).check()

    //box thứ 3 (ở cuối) là custom box
    await page.getByTestId('checkbox-custom').click()

    //verify kết quả box 1 và box 3
    await expect (page.getByRole('checkbox', {name: 'Native Checkbox'})).toBeChecked()
    await expect (page.getByTestId('checkbox-custom')).toHaveClass(/bg-primary/)

    })
