//tự viết
//Playwright không tự động thêm import 
//khi bạn chỉ tạo một file .spec.ts trống
import { test, expect} from '@playwright/test';
//import <login.page.ts>
//để qua page './login.page'-> ctrl+click vào './login.page'
import { loginPage} from './pages/login.page';



test ('test', async({page})=>{
    await page.goto('https://the-internet.herokuapp.com/login');

    // getByRole('textbox', { name: 'Username' })
    // = LOCATOR: tìm element có role là textbox và tên là Username.
    //
    // textbox = loại element dùng để nhập text.
    // name: 'Username' = tên mà Playwright dùng để xác định đúng textbox Username.
    //
    // fill('tomsmith')
    // = ACTION: điền "tomsmith" vào textbox.
    //
    // Hình dung:
    // TÌM textbox Username
    //        ↓
    // ĐIỀN "tomsmith"
    //
    // Đây là công thức rất quan trọng:
    // LOCATOR → tìm element
    // ACTION   → thao tác với element.
    await page.getByRole('textbox', { name: 'Username' }).fill('tomsmith');

    // getByRole('textbox', { name: 'Password' })
    // = LOCATOR: tìm textbox Password.
    //
    // fill(...)
    // = ACTION: điền password vào textbox.
    //
    // Hình dung:
    // TÌM textbox Password
    //        ↓
    // ĐIỀN "SuperSecretPassword!"
    await page.getByRole('textbox', { name: 'Password' }). fill('SuperSecretPassword!');
    await page.getByRole('button', { name: ' Login' }).click();
    
    //bấm nút log in xong await
    //chờ web chuyển qua web page kế sau khi log in
    //
    // getByRole('button', { name: ' Login' })
    // = LOCATOR: tìm BUTTON Login.
    //
    // '' là ký tự/icon mà trang web đang dùng trong accessible name
    // của button. Codegen đã ghi lại nó.
    //
    // click()
    // = ACTION: click vào button Login.
    //
    // Hình dung:
    // Username: tomsmith
    // Password: SuperSecretPassword!
    //             ↓
    //          [ Login ]
    //             ↓ click
    //          Server xử lý login
    //
    // await = chờ thao tác click/điều hướng cần thiết hoàn thành
    // trước khi chạy assertion tiếp theo.

    // SAU KHI CLICK LOGIN:
    // Test không chỉ muốn biết "click có xảy ra không".
    // Test cần kiểm tra KẾT QUẢ của việc login.
    //
    // Vì vậy bước tiếp theo là ASSERTION.
    //
    //
    // expect(page)
    // = bắt đầu kiểm tra trạng thái/kết quả của page.
    //
    // toHaveURL(...)
    // = ASSERTION: kiểm tra URL hiện tại của browser.
    //
    // URL mong đợi:
    // https://the-internet.herokuapp.com/secure
    // Đúng URL → PASS
    // Sai URL → FAIL
    //

    await expect(page).toHaveURL('https://the-internet.herokuapp.com/secure');
    
    
    // VERIFY TEXT TRÊN PAGE
    // Sau khi kiểm tra URL, mình kiểm tra tiếp nội dung hiển thị trên page.
    // getByText(...)
    // = LOCATOR: tìm element có chứa text:
    // "You logged into a secure area"
    //
    // toBeVisible()
    // = ASSERTION: kiểm tra element chứa text đó có đang hiển thị hay không.
    //
    // Như vậy dòng này đang VERIFY UI,
    // chứ không thực hiện một action.

    // LẤY ELEMENT ĐẦU TIÊN
    // .first() = lấy element ĐẦU TIÊN trong những element
    // mà locator tìm thấy.
    //
    // Lưu ý:
    // .first() KHÔNG hoàn toàn giống exact: true.
    //
    // exact: true
    // = yêu cầu NAME/TEXT khớp chính xác.
    //
    // first()
    // = nếu locator tìm được nhiều element,
    // lấy element đứng đầu tiên trong danh sách kết quả.
    //
    // Vì vậy hai khái niệm này khác nhau.
    await expect(page.getByText('You logged into a secure area')).toBeVisible();
    //lấy element đầu tiên- tương tự exact= true
    //
    //
    await expect (page.getByRole('heading', {name: 'Secure Area'}).first()). toBeVisible();
// Kết thúc TEST CASE
});

//test case 2
//invalid password
test ('test2', async({page})=>{
    await page.goto('https://the-internet.herokuapp.com/login');
    await page.getByRole('textbox', { name: 'Username' }).fill('tomsmith');
    // nhập PASSWORD SAI: "SuperPass!"
    await page.getByRole('textbox', { name: 'Password' }). fill('SuperPass!');
    //Nếu test dừng ở dòng click() hoặc assertion phía sau fail, 
    // thì UI Mode có thể cho bạn thấy action click đã xảy ra, 
    // nhưng không có nghĩa là Playwright đang hiển thị tất cả những gì mắt người 
    // nhìn thấy trên website.
    await page.getByRole('button', { name: ' Login' }).click();
    //verify text khi log in bị fail
    // getByText(...)
    // = TÌM thông báo lỗi trên page.
    //
    // "Your password is invalid! ×"
    // = nội dung mà test mong đợi xuất hiện.
    //
    // toBeVisible()
    // = kiểm tra thông báo lỗi có hiển thị hay không.
    //
    // Nếu thông báo xuất hiện → PASS.
    // Nếu không xuất hiện → FAIL.
    await expect(page.getByText('Your password is invalid! ×')).toBeVisible();
// Kết thúc TEST CASE
})

//invalid username
test ('test3', async({page})=>{
    await page.goto('https://the-internet.herokuapp.com/login');
    // nhập username SAI: "toms"
    await page.getByRole('textbox', { name: 'Username' }).fill('toms');
    await page.getByRole('textbox', { name: 'Password' }). fill('SuperSecretPassword!');
    //Nếu test dừng ở dòng click() hoặc assertion phía sau fail, 
    // thì UI Mode có thể cho bạn thấy action click đã xảy ra, 
    // nhưng không có nghĩa là Playwright đang hiển thị tất cả những gì mắt người 
    // nhìn thấy trên website.
    await page.getByRole('button', { name: ' Login' }).click();
    //verify text khi log in bị fail
    // TÌM thông báo:
    // "Your username is invalid! ×"
    //
    // toBeVisible()
    // = kiểm tra thông báo lỗi có hiển thị trên page.
    //
    // Có thông báo → PASS.
    // Không có thông báo → FAIL.
    await expect(page.getByText('Your username is invalid! ×')).toBeVisible();
// Kết thúc TEST CASE
})

//test case 4- test bằng Page bên login.page.ts
test ('test4', async({page})=>{
    test.setTimeout(60000);
     // Khởi tạo object từ class loginPage trong login.page.ts
    const loginPageObject = new loginPage(page)
    await loginPageObject.open()
    await loginPageObject.login('tomsmith', 'SuperSecretPassword!')

    //await expect(page).toHaveURL('https://the-internet.herokuapp.com/secure');
    // .resolves
    // Cho Playwright Test biết rằng bạn muốn kiểm tra giá trị mà Promise hoàn thành với, 
    // thay vì kiểm tra trực tiếp object Promise.
    // Khi Promise hoàn thành, giá trị nhận được sẽ là true hoặc false.
    // .toBe(true)
    // Kiểm tra giá trị cuối cùng có đúng bằng boolean true hay không.
    // true -> assertion thành công.
    // false -> assertion thất bại.
    await expect(loginPageObject.isloginSuccess()).resolves.toBe(true)
    await expect (page.getByRole('heading', {name: 'Secure Area'}).first()). toBeVisible();

});
//