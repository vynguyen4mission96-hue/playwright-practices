//tự viết
import {test, expect} from '@playwright/test';

test ('verify body mass index(BMI) calculation', async({page})=>{
    test.setTimeout(60000);
    await page.goto('https://www.calculator.net/bmi-calculator.html')

    await page.getByRole('link', {name: 'Metric Units'}).click()
    // nó là age- nhưng mà element là cage
    //<input type="text" name="cage" id="cage" value="25" 
    //class="inhalf" onkeyup="iptfieldCheck(this, 'r', 'pn');">
    await page.locator('#cage').fill('25')
    await page.getByRole('radio', {name:'Male', exact: true}).check()
    await page.locator('#cheightmeter').fill('180')
    await page.locator('#ckg').fill('75')
    await page.getByRole('button', {name: 'Calculate'}).click()

    const bmiResults =page.locator('.rightresult .bigtext')
    //toHaveText normalize whitespace (incl. non-breaking spaces) and auto-retries
    // toHaveText() chuẩn hóa khoảng trắng (kể cả NBSP) 
    // và tự động thử lại assertion cho đến khi Pass hoặc hết timeout.
    await expect(bmiResults).toHaveText( 'BMI = 23.1 kg/m2 (Normal)')

})