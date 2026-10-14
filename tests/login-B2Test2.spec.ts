//tự viết
//Playwright không tự động thêm import 
//khi bạn chỉ tạo một file .spec.ts trống
//import { test, expect} from '@playwright/test';
//import <login.page.ts>
//để qua page './login.page'-> ctrl+click vào './login.page'
//import { loginPage} from './pages/login.page';
//
//thay thế cho những cái ở trên (file: heroku.fixture )
import {test, expect} from './fixtures/heroku.fixture';



//test case 4- test bằng Page bên login.page.ts
test ('login sucessfully', async({loginPage, getcurrentUrl})=>{
    test.setTimeout(60000);
    // Fixture đã khởi tạo loginPage object, không cần new loginPage(page)
    await loginPage.open()
    // Đăng nhập bằng method của Page Object
    await loginPage.login('tomsmith', 'SuperSecretPassword!')
    // Kiểm tra URL bằng getter từ fixture
    expect(await getcurrentUrl()).toBe('https://the-internet.herokuapp.com/secure');
    await expect(loginPage.isloginSuccess()).resolves.toBe(true)
    await expect (loginPage.page.getByRole('heading', {name: 'Secure Area'}).first()). toBeVisible();

});

//invalid password
test ('invalid password', async({loginPage})=>{
    test.setTimeout(60000);
    await loginPage.open()
    // nhập PASSWORD SAI: "SuperPass!"
    await loginPage.login('tomsmith', 'SuperPass!');
    //
    await expect(loginPage.getPasswordErrorMessage())
        .toContainText('Your password is invalid!');

    await expect(loginPage.getPasswordErrorMessage())
        .toContainText('Your password is invalid!');
    //await expect(loginPage.isPasswordErrorVisible()).resolves.toBe(true)
    
// Kết thúc TEST CASE
})

//invalid username
test ('invalid username', async({loginPage})=>{
    test.setTimeout(60000);
   await loginPage.open()
    // nhập username SAI: "toms"
    await loginPage.login('tomsmith!', 'SuperSecretPassword!')
   //
    await expect(loginPage.getUsernameErrorMessage())
            .toContainText('Your username is invalid!');
    await expect(loginPage.getUsernameErrorMessage())
            .toBeVisible();
    //await expect(loginPage.isUsernameErrorVisible()).resolves.toBe(true)
    
// Kết thúc TEST CASE
})