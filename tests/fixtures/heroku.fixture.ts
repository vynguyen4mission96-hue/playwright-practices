import {test as base} from '@playwright/test';
export {expect } from '@playwright/test';
import { loginPage} from '../pages/login.page';


//define all pages under the-internet.herokuapp.com
type HerokuPages={
    loginPage: loginPage
    getcurrentUrl:()=> Promise<string>
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
    
    //provide a lazy getter so age.url() is read when the test calls it
    //not eagerly at fixture setup time (before the pgae has navigate)
    getcurrentUrl: async({page}, use)=>{
        await use(async() => page.url())
    }
})
