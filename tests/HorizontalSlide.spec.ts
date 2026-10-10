import {test, expect} from '@playwright/test';

test('change range slider value', async ({ page }) => {
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);

    // Go to the horizontal slider page
    await page.goto('https://the-internet.herokuapp.com/horizontal_slider');
    
    // Get the initial value of the slider
    //element của slider là:
    //<input type="range" min="0.0" max="5.0" step="0.5" value="0" onchange="showValue(this.value)">
    //selector(CSS selector):
    //#content > div > div > input[type=range]
    //const slider = page.locator('input[type="range"]');
    const slider = page.locator('.sliderContainer input')
    
    
    // Kiểm tra slider có hiển thị và có thể thao tác
    //để có thời gian load page
    //await expect(slider).toBeVisible();
    //await expect(slider).toBeEnabled();

    var sliderValue = Number(await page.locator('#range').innerText());
    const range = 3.5 // set a value between 0-5 , intervals of 0.5 only
    while (sliderValue < range) { 
        //press có keyboard  
        await slider.press('ArrowRight');
        sliderValue = Number(await page.locator('#range').innerText());
        console.log("Press ArrowRight")
    }
    expect(sliderValue).toBe(range);
})
