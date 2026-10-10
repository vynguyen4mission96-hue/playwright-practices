//tự viết- import để nó đừng bị error
import {test, expect} from '@playwright/test';

//test case 1
test('verify check sucessfully', async({page})=>{
    // Tăng thời gian tối đa của riêng test này từ 30 giây lên 60 giây
    //chỉnh trong Trong playwright.config.ts cũng được
    test.setTimeout(60000);

    await page.goto('https://the-internet.herokuapp.com/checkboxes')

    // Kiểm tra checkbox đầu tiên có tồn tại
    //await expect(page.getByRole('checkbox').first()).toBeVisible();

    // Kiểm tra checkbox đầu tiên có thể tương tác
    //await expect(page.getByRole('checkbox').first()).toBeEnabled();

    // Thực hiện check
    //nếu dừng ở step này thì trên Ui mode chỉ thấy nó click check thôi, 
    // không kết quả sau khi check (vì nó là máy)
    await page.getByRole('checkbox').first().check()

     // Xác nhận checkbox đầu tiên đang được check
     //cần bước này để thấy sau khi nó click vào checkbox
    await expect(page.getByRole('checkbox').first()).toBeChecked()

    //checkbox thứ 2- do default của page là checkbox 2 nó check sẵn
    //giờ test case: uncheck
    //nhớ: step+ verify (expected results)
    await page.getByRole('checkbox').last().uncheck()
    await expect(page.getByRole('checkbox').last()).not.toBeChecked()
})
