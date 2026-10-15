import {test as base} from '@playwright/test';
export {expect } from '@playwright/test';
import { loginPage} from '../pages/login.page';
import { ForgotPasswordPage } from '../pages/forgotpassword.page';


//define all pages under the-internet.herokuapp.com
//viết lại cho quen tay- fixture bên heroku.fixture.ts đã cover luôn rồi
type HerokuPages={
    loginPage: loginPage
    forgotPasswordPage: ForgotPasswordPage
    
}

export const test =base.extend<HerokuPages>({
    loginPage: async ({page}, use)=>{
        const Login_Page =new loginPage(page)
        console.log('loginPage fixture is created ==before use()')
        await use (Login_Page)
        console.log('loginPage fixture is disposed == after use()')
        // Phải có dấu phẩy sau block này để phân tách với property bên dưới.
        //loginPage và getcurrentUrl là hai property của object đó.
    },
    //viết lại cho quen tay- fixture bên heroku.fixture.ts đã cover luôn rồi
    forgotPasswordPage: async({page}, use)=>{
        const forgotPassword = new ForgotPasswordPage(page)
        await use(forgotPassword)
    }
  

})
