import { expect, type Locator, type Page } from '@playwright/test';

export class loginPage{
    //properties <locators>
    // </locators>
    // Properties: khai báo các thuộc tính
    readonly page: Page;

    //constructor
    //nhận page và lưu vào property của class
    constructor(page:Page){
        this.page=page;
    }

    //methods <user behavior methods => define first
    //định nghĩa hành vi của trang
    async open(){

        await this.page.goto('https://the-internet.herokuapp.com/login')
        await this.page.getByRole('textbox', { name: 'Username' }).waitFor({
        state: 'visible'
    });
    }

    async login( username: string, password:string){
    await this.page.getByRole('textbox', { name: 'Username' }).fill(username);
    await this.page.getByRole('textbox', { name: 'Password' }). fill(password);
    await this.page.getByRole('button', { name: 'Login' }).click();
    }
    async isloginSuccess(){
        //thêm dòng await này vì web load lâu quá
        // Chờ phần tử hiển thị (visible) trước khi kiểm tra trạng thái
        // Nếu phần tử không hiển thị trong thời gian chờ, Playwright sẽ báo lỗi
        //bỏ dòng này cũng được, do web app không ổn định
        await this.page.getByText('You logged into a secure area')
        .first().waitFor({ state: 'visible' });
        //
        //
        //first()
        //cách viết khác bên file spec.ts
        // Nếu locator tìm thấy nhiều phần tử phù hợp, .first() chọn phần tử đầu tiên.
        // Nếu chỉ có một phần tử phù hợp, bạn thường không cần .first().
        //.isVisible()
        // Kiểm tra phần tử được chọn có đang hiển thị hay không.
        // Kết quả trả về là giá trị boolean:
        // true: phần tử đang hiển thị.
        // false: phần tử không hiển thị hoặc không tồn tại tại thời điểm kiểm tra.
        //return await
        //await: chờ thao tác bất đồng bộ isVisible() trả về kết quả.
        //return: trả kết quả đó cho nơi gọi method.
        
        return await this.page.getByText('You logged into a secure area')
        .first().isVisible();
    }

     async isPasswordErrorVisible(){
              return await this.page.getByText('Your password is invalid!').isVisible()
         }

     async isUsernameErrorVisible(){
               return await this.page.getByText('Your username is invalid!').isVisible()
            }

    // Kiểm tra thông báo password sai
    getPasswordErrorMessage() {
        return this.page.locator('#flash');
    }

    // Kiểm tra thông báo username sai
    getUsernameErrorMessage() {
        return this.page.locator('#flash');
    }

}
//lúc chạy lcu1 không
//web này không ổn định
