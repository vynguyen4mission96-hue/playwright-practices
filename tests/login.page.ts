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

        this.page.goto('https://the-internet.herokuapp.com/login')
    }

    async login( username: string, password:string){
    await this.page.getByRole('textbox', { name: 'Username' }).fill('tomsmith');
    await this.page.getByRole('textbox', { name: 'Password' }). fill('SuperSecretPassword!');
    await this.page.getByRole('button', { name: ' Login' }).click();
    }
    async isloginSuccess(){
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
        return await this.page.getByText('You logged into a secure area').first().isVisible();
    }

}