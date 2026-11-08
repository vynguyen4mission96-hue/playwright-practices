//tự viết- import để nó đừng bị error
import {test, expect} from './fixtures/checkboxes.fixture';

//test case 1
test('verify checkboxes', async({CheckboxPage})=>{
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);
    await CheckboxPage.open()
    //chọn
    await CheckboxPage.check('checkbox 1')
    expect(await CheckboxPage.isChecked('checkbox 1')).toBe(true)
    //bỏ chọn
    await CheckboxPage.check('checkbox 2')
    expect(await CheckboxPage.isChecked('checkbox 2')).toBe(false)
    
})
