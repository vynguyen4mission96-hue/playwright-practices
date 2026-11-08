// Tự viết
// Playwright không tự động thêm import khi tạo file .spec.ts trống.
// Dùng Fixture thay cho việc import và khởi tạo Page Object trực tiếp.
import { test, expect } from './fixtures/heroku.fixture';

// Test case 4 - test bằng Page Object trong login.page.ts
test('login successfully', async ({ loginPage, getcurrentUrl }) => {
    test.setTimeout(60000);

    // Fixture đã khởi tạo loginPage object.
    await loginPage.open();

    // Đăng nhập bằng tài khoản hợp lệ.
    await loginPage.login('tomsmith', 'SuperSecretPassword!');

    // Kiểm tra URL hiện tại.
    await expect.poll(getcurrentUrl)
        .toBe('https://the-internet.herokuapp.com/secure');

    // Kiểm tra đăng nhập thành công.
    await expect(loginPage.isloginSuccess()).resolves.toBe(true);

    // Kiểm tra heading Secure Area hiển thị.
    await expect(
        loginPage.page.getByRole('heading', { name: 'Secure Area' }).first()
    ).toBeVisible();
});


// Gộp test invalid password và invalid username thành một data test.
//data-driven for test case
[
    {
        username: 'tomsmith',
        password: 'SuperSecretPassword!',
        expectedResult: 'success'
    },
    {
        username: 'tomsmith',
        password: 'SuperPass!',
        errorMessage: 'Your password is invalid!',
        expectedResult: 'error'
    },
    {
        username: 'tomsmith!',
        password: 'SuperSecretPassword!',
        errorMessage: 'Your username is invalid!',
        expectedResult: 'error'
    }
].forEach(({ username, password, errorMessage, expectedResult }) => {

    test(`login with errormassge ${errorMessage} for username ${username} and password: ${password}`, async ({ loginPage }) => {
        test.setTimeout(60000);

        // Mở trang Login.
        await loginPage.open();

        // Đăng nhập với dữ liệu của test hiện tại.
        await loginPage.login(username, password);

        // Kiểm tra kết quả theo từng bộ dữ liệu.
        if (expectedResult === 'success') {
            await expect(
            loginPage.page.getByRole('heading', {
            name: 'Secure Area',
            exact: true
            })
        ).toBeVisible();

        } else if (expectedResult === 'passwordError') {
            // Kiểm tra thông báo password sai.
            await expect(loginPage.getPasswordErrorMessage())
                .toContainText(errorMessage!);

        } else if (expectedResult === 'usernameError') {
            // Kiểm tra thông báo username sai.
            await expect(loginPage.getUsernameErrorMessage())
                .toContainText(errorMessage!);
        }
    });
});

// //invalid password
// test ('invalid password', async({loginPage})=>{
//     test.setTimeout(60000);
//     await loginPage.open()
//     // nhập PASSWORD SAI: "SuperPass!"
//     await loginPage.login('tomsmith', 'SuperPass!');
//     //
//     await expect(loginPage.getPasswordErrorMessage())
//         .toContainText('Your password is invalid!');

//     await expect(loginPage.getPasswordErrorMessage())
//         .toContainText('Your password is invalid!');
//     //await expect(loginPage.isPasswordErrorVisible()).resolves.toBe(true)
    
// // Kết thúc TEST CASE
// })

// //invalid username
// test ('invalid username', async({loginPage})=>{
//     test.setTimeout(60000);
//    await loginPage.open()
//     // nhập username SAI: "toms"
//     await loginPage.login('tomsmith!', 'SuperSecretPassword!')
//    //
//     await expect(loginPage.getUsernameErrorMessage())
//             .toContainText('Your username is invalid!');
//     await expect(loginPage.getUsernameErrorMessage())
//             .toBeVisible();
//     //await expect(loginPage.isUsernameErrorVisible()).resolves.toBe(true)
    
// // Kết thúc TEST CASE
// })